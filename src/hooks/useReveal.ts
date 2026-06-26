import { useEffect, useRef } from 'react';

/**
 * Attaches an IntersectionObserver to a container and reveals any descendant
 * with the `.ed-reveal` class as it scrolls into view. Add `.d1`–`.d6` for
 * staggered delays. One-shot: each element is unobserved after it appears.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const els = root.querySelectorAll<HTMLElement>('.ed-reveal');

    // Respect reduced-motion: reveal everything immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return ref;
}
