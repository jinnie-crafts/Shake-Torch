const NATIVE_BRIDGE_NAME = 'ShakeTorchBridge';

class NativeBridge {
  constructor() {
    this.isNative = !!window[NATIVE_BRIDGE_NAME];
  }

  // --- Outbound to Native ---

  startService() {
    if (this.isNative) {
      window[NATIVE_BRIDGE_NAME].startService();
    } else {
      console.log("[Mock] startService called");
      // Simulate native callback
      setTimeout(() => this.receiveServiceStatus(true), 500);
    }
  }

  stopService() {
    if (this.isNative) {
      window[NATIVE_BRIDGE_NAME].stopService();
    } else {
      console.log("[Mock] stopService called");
      setTimeout(() => this.receiveServiceStatus(false), 500);
    }
  }

  updateSettings(settings) {
    const jsonStr = JSON.stringify(settings);
    if (this.isNative) {
      window[NATIVE_BRIDGE_NAME].updateSettings(jsonStr);
    } else {
      console.log("[Mock] updateSettings:", jsonStr);
    }
  }

  requestCapabilities() {
    if (this.isNative) {
      window[NATIVE_BRIDGE_NAME].requestCapabilities();
    } else {
      console.log("[Mock] requestCapabilities called");
      setTimeout(() => {
        this.receiveCapabilities({
          sensorsAvailable: true,
          torchAvailable: true,
          lockAvailable: false // Mock lacking device admin
        });
      }, 300);
    }
  }

  requestServiceStatus() {
    if (this.isNative) {
      window[NATIVE_BRIDGE_NAME].requestServiceStatus();
    } else {
      console.log("[Mock] requestServiceStatus called");
    }
  }

  setDiagnosticMode(enabled) {
    if (this.isNative) {
      if (window[NATIVE_BRIDGE_NAME].setDiagnosticMode) {
        window[NATIVE_BRIDGE_NAME].setDiagnosticMode(enabled);
      }
    } else {
      console.log("[Mock] Diagnostic mode:", enabled);
    }
  }

  // --- Inbound from Native ---
  // Native layer calls these functions via WebView.evaluateJavascript()

  receiveServiceStatus(isRunning) {
    if (window.UIHandler) {
      window.UIHandler.updateServiceStatus(isRunning);
    }
  }

  receiveCapabilities(caps) {
    if (window.UIHandler) {
      window.UIHandler.updateCapabilities(caps);
    }
  }

  receiveDiagnostics(data) {
    if (window.UIHandler) {
      window.UIHandler.updateDiagnostics(data);
    }
  }
}

// Attach globally so Native code can easily access incoming functions
window.Bridge = new NativeBridge();
