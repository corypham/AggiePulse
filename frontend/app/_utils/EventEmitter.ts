type Listener = (...args: any[]) => void;

class EventEmitter {
  private listeners: { [key: string]: Listener[] } = {};

  addListener(eventName: string, listener: Listener) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listener);
    return {
      remove: () => this.removeListener(eventName, listener)
    };
  }

  removeListener(eventName: string, listener: Listener) {
    if (!this.listeners[eventName]) return;
    this.listeners[eventName] = this.listeners[eventName].filter(l => l !== listener);
  }

  emit(eventName: string, ...args: any[]) {
    if (!this.listeners[eventName]) return;
    this.listeners[eventName].forEach(listener => listener(...args));
  }
}

export default new EventEmitter(); 