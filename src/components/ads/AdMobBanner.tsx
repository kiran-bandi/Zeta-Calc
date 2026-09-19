import React, { useEffect, useState } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdPluginEvents } from '@capacitor-community/admob';
import { isNativeMobile } from '../../mobile/capacitorBridge';

// Official Google AdMob Demo Banner Ad ID provided by user
export const DEMO_BANNER_AD_ID = 'ca-app-pub-3940256099942544/6300978111';

export function AdMobBanner() {
  const [isNative, setIsNative] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);

  useEffect(() => {
    const native = isNativeMobile();
    setIsNative(native);

    let isMounted = true;

    async function initAdMob() {
      if (!native) return;

      try {
        // Initialize AdMob SDK
        await AdMob.initialize({
          initializeForTesting: true,
        });

        // Listen for AdMob banner events
        const loadedListener = await AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
          if (isMounted) {
            setAdLoaded(true);
            setAdError(null);
          }
        });

        const failedListener = await AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (err: any) => {
          if (isMounted) {
            setAdError(err?.message || 'AdMob failed to load');
          }
        });

        // Show banner ad
        await AdMob.showBanner({
          adId: DEMO_BANNER_AD_ID,
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: true,
        });

        return () => {
          loadedListener.remove();
          failedListener.remove();
          AdMob.hideBanner().catch(() => {});
          AdMob.removeBanner().catch(() => {});
        };
      } catch (err: any) {
        console.warn('AdMob native banner initialization:', err);
        if (isMounted) {
          setAdError(err?.message || 'Native AdMob not initialized');
        }
      }
    }

    const cleanupPromise = initAdMob();

    return () => {
      isMounted = false;
      cleanupPromise.then((cleanup) => {
        if (cleanup) cleanup();
      }).catch(() => {});
    };
  }, []);

  return (
    <div className="w-full bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-2 px-4 text-center select-none sticky bottom-0 z-40 shadow-sm">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-amber-500 text-white font-extrabold text-[10px] tracking-wider uppercase">
            AdMob Test
          </span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Google Demo Banner Ad
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">● ID:</span>
          <span>{DEMO_BANNER_AD_ID}</span>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          {isNative ? (
            adLoaded ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Native AdMob Active</span>
            ) : adError ? (
              <span className="text-amber-600 dark:text-amber-400">Test Mode (ID Active)</span>
            ) : (
              <span className="text-blue-600 dark:text-blue-400">Loading Native Ad...</span>
            )
          ) : (
            <span className="text-slate-500 dark:text-slate-400">Ready for Android/Capacitor Build</span>
          )}
        </div>
      </div>
    </div>
  );
}
