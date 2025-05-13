class CacheService {
    constructor(expirationTime = 5 * 60 * 1000) {
        this.cache = new Map();
        this.expirationTime = expirationTime;
    }

    set(key, value) {
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        const now = Date.now();
        if (now - item.timestamp > this.expirationTime) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    clear() {
        this.cache.clear();
    }
}

export const diagnosesCache = new CacheService();
export const patientsCache = new CacheService();
