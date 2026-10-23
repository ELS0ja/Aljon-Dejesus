import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AboutPhoto } from '../types/portfolio';
import '../../../css/about-slideshow.css';

interface AboutSlideshowProps {
  photos: readonly AboutPhoto[];
}

interface ImageRequest {
  ready: Promise<boolean>;
  cancel: () => void;
}

const AUTOPLAY_INTERVAL = 4000;

export function AboutSlideshow({ photos }: AboutSlideshowProps) {
  const slidesId = useId();
  const [frame, setFrame] = useState({ index: 0, previous: null as number | null });
  const [timerRevision, setTimerRevision] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pending, setPending] = useState(false);
  const [hidden, setHidden] = useState(() => typeof document !== 'undefined' && document.hidden);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const mounted = useRef(false);
  const requests = useRef(new Map<string, ImageRequest>());
  const manualRequest = useRef(0);
  const touchStart = useRef<{ id: number; x: number; y: number } | null>(null);
  const count = photos.length;
  const index = frame.index % (count || 1);
  const nextPhoto = photos[(index + 1) % (count || 1)];
  const canAutoplay = count > 1 && !hovered && !focused && !hidden && !reducedMotion && !pending;

  useEffect(() => {
    mounted.current = true;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = () => setReducedMotion(media.matches);
    const onVisibilityChange = () => setHidden(document.hidden);
    media.addEventListener('change', onMotionChange);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      mounted.current = false;
      manualRequest.current++;
      media.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      requests.current.forEach((request) => request.cancel());
      requests.current.clear();
    };
  }, []);

  const preparePhoto = useCallback((src: string) => {
    const cached = requests.current.get(src);
    if (cached) return cached.ready;

    const image = new Image();
    let finish: (ready: boolean) => void = () => {};
    const ready = new Promise<boolean>((resolve) => {
      let settled = false;
      finish = (result) => {
        if (settled) return;
        settled = true;
        image.onload = null;
        image.onerror = null;
        resolve(result);
      };
      image.onload = () => {
        // Decode before revealing the image, keeping the current photo visible meanwhile.
        void image.decode().then(() => finish(true), () => finish(image.naturalWidth > 0));
      };
      image.onerror = () => finish(false);
    });
    requests.current.set(src, { ready, cancel: () => finish(false) });
    image.src = src;
    return ready;
  }, []);

  useEffect(() => {
    if (count > 1 && nextPhoto) void preparePhoto(nextPhoto.src);
  }, [count, nextPhoto?.src, preparePhoto]);

  useEffect(() => {
    if (reducedMotion && frame.previous !== null) setFrame((current) => ({ ...current, previous: null }));
  }, [reducedMotion, frame.previous]);

  useEffect(() => {
    if (!canAutoplay || !nextPhoto) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      const ready = await preparePhoto(nextPhoto.src);
      if (!cancelled && ready) {
        setFrame({ index: (index + 1) % count, previous: index });
      }
    }, AUTOPLAY_INTERVAL);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [canAutoplay, count, index, nextPhoto?.src, preparePhoto, timerRevision]);

  const showPhoto = useCallback(async (requestedIndex: number) => {
    if (count < 2) return;
    const target = ((requestedIndex % count) + count) % count;
    const request = ++manualRequest.current;
    setTimerRevision((revision) => revision + 1);
    setPending(true);
    const ready = await preparePhoto(photos[target].src);
    if (!mounted.current || request !== manualRequest.current) return;
    if (ready) {
      setFrame((current) => current.index === target ? current : {
        index: target,
        previous: reducedMotion ? null : current.index % count,
      });
    }
    setPending(false);
  }, [count, photos, preparePhoto, reducedMotion]);

  if (count === 0) return null;

  const previous = frame.previous !== null && photos[frame.previous] && frame.previous !== index
    ? frame.previous : null;
  const visibleSlides = previous === null ? [index] : [previous, index];

  return (
    <div
      className="about-slideshow relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-panel"
      role={count > 1 ? 'region' : undefined}
      aria-roledescription={count > 1 ? 'carousel' : undefined}
      aria-label={count > 1 ? 'About me photos' : undefined}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
      onKeyDown={(event) => {
        if (count < 2 || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const target = event.key === 'Home' ? 0 : event.key === 'End' ? count - 1
          : index + (event.key === 'ArrowRight' ? 1 : -1);
        void showPhoto(target);
      }}
      onPointerDown={(event) => {
        if (count < 2 || event.pointerType !== 'touch' || !event.isPrimary || (event.target as Element).closest('button')) return;
        touchStart.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerUp={(event) => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start || start.id !== event.pointerId) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
          void showPhoto(index + (dx < 0 ? 1 : -1));
        }
      }}
      onPointerCancel={() => { touchStart.current = null; }}
    >
      <div id={slidesId} className="about-slideshow__slides" aria-live={canAutoplay ? 'off' : 'polite'} aria-atomic="true">
        {visibleSlides.map((slideIndex) => {
          const photo = photos[slideIndex];
          const active = slideIndex === index;
          return (
            <div
              key={`${slideIndex}-${photo.src}`}
              className={`about-slideshow__slide${active ? ' about-slideshow__slide--active' : ''}${active && previous !== null && !reducedMotion ? ' about-slideshow__slide--enter' : ''}`}
              role={count > 1 ? 'group' : undefined}
              aria-roledescription={count > 1 ? 'slide' : undefined}
              aria-label={count > 1 ? `${slideIndex + 1} of ${count}` : undefined}
              aria-hidden={!active}
              onAnimationEnd={(event) => {
                if (active && event.target === event.currentTarget) {
                  setFrame((current) => current.index === slideIndex ? { ...current, previous: null } : current);
                }
              }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                style={{ objectPosition: photo.position ?? '50% 50%' }}
                width={photo.width ?? 800}
                height={photo.height ?? 1000}
                loading={slideIndex === 0 ? 'lazy' : 'eager'}
                decoding="async"
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <div className="about-slideshow__controls">
          <button
            type="button"
            className="about-slideshow__button about-slideshow__arrow about-slideshow__arrow--previous"
            aria-label="Previous photo"
            aria-controls={slidesId}
            onClick={() => void showPhoto(index - 1)}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="about-slideshow__button about-slideshow__arrow about-slideshow__arrow--next"
            aria-label="Next photo"
            aria-controls={slidesId}
            onClick={() => void showPhoto(index + 1)}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
          <div className="about-slideshow__pagination" role="group" aria-label="Choose a photo">
            {photos.map((photo, photoIndex) => (
              <button
                key={`${photoIndex}-${photo.src}`}
                type="button"
                className="about-slideshow__dot"
                aria-label={`Show photo ${photoIndex + 1}: ${photo.alt}`}
                aria-current={photoIndex === index ? 'true' : undefined}
                aria-controls={slidesId}
                onClick={() => void showPhoto(photoIndex)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
