import { useState, useEffect, useRef, RefObject } from "react";

export interface IntersectionObserverOptions {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

export default function useIntersectionObserver<T extends Element = Element>({
  root = null,
  rootMargin = "0px",
  threshold = 0,
  once = false,
}: IntersectionObserverOptions = {}): [RefObject<T>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);

        // If "once" is true and element is intersecting, unobserve after triggering
        if (once && isElementIntersecting && element) {
          observer.unobserve(element);
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [root, rootMargin, threshold, once]);

  return [elementRef, isIntersecting];
}

// Helper hook to add animation classes when elements come into view
export function useAnimateOnScroll<T extends Element = Element>(
  options: IntersectionObserverOptions = {}
): [RefObject<T>, string] {
  const [ref, isInView] = useIntersectionObserver<T>(options);
  const animationClass = isInView ? "animate-fade-in" : "opacity-0";
  
  return [ref, animationClass];
}

// Helper hook to trigger callbacks when elements come into view
export function useInViewCallback(
  callback: () => void,
  options: IntersectionObserverOptions = {}
): RefObject<Element> {
  const [ref, isInView] = useIntersectionObserver(options);
  
  useEffect(() => {
    if (isInView) {
      callback();
    }
  }, [isInView, callback]);
  
  return ref;
}
