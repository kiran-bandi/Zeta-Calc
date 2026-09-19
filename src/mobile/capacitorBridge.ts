import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

/**
 * Checks if the application is running inside a native mobile container (Android or iOS).
 */
export function isNativeMobile(): boolean {
  return Capacitor.isNativePlatform();
}

/**
 * Gets the current mobile platform ('android', 'ios', or 'web').
 */
export function getMobilePlatform(): 'android' | 'ios' | 'web' {
  return Capacitor.getPlatform() as 'android' | 'ios' | 'web';
}

/**
 * Initializes mobile native layers (Status bar, Splash screen, Hardware back button)
 * safely. If running on desktop web or mobile browser, this immediately and silently no-ops.
 */
export function initCapacitorMobile(onBackButton?: () => boolean): () => void {
  if (!Capacitor.isNativePlatform()) {
    return () => {};
  }

  // 1. Configure Native Status Bar
  try {
    StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    if (Capacitor.getPlatform() === 'android') {
      StatusBar.setBackgroundColor({ color: '#ffffff' }).catch(() => {});
    }
  } catch {
    // Non-blocking fallback
  }

  // 2. Hide Splash Screen smoothly once UI is mounted
  try {
    setTimeout(() => {
      SplashScreen.hide().catch(() => {});
    }, 400);
  } catch {
    // Non-blocking fallback
  }

  // 3. Android Hardware Back Button Listener
  let removeListener: (() => void) | null = null;
  try {
    const handleBackButton = App.addListener('backButton', ({ canGoBack }) => {
      // If caller provided a custom handler and it handled it (e.g. closed a modal), return
      if (onBackButton && onBackButton()) {
        return;
      }

      // Check browser/window history
      if (window.history.length > 1 && window.location.pathname !== '/' && window.location.hash !== '') {
        window.history.back();
      } else if (canGoBack) {
        window.history.back();
      } else {
        // At root screen with nowhere to go back, exit or minimize the app
        App.exitApp().catch(() => {});
      }
    });

    handleBackButton.then((listener) => {
      removeListener = () => listener.remove();
    });
  } catch {
    // Non-blocking fallback
  }

  return () => {
    if (removeListener) {
      removeListener();
    }
  };
}
