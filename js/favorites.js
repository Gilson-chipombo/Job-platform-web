// ============================================
// FAVORITES MANAGER - VAGAS SALVAS
// ============================================

/**
 * Gerenciar favoritos de vagas
 */
class FavoritesManager {
    constructor() {
        this.storageKey = 'favoriteJobs';
        this.favorites = this.loadFavorites();
    }

    /**
     * Carregar favoritos do localStorage
     */
    loadFavorites() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    /**
     * Salvar favoritos no localStorage
     */
    saveFavorites() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
    }

    /**
     * Adicionar vaga aos favoritos
     */
    addFavorite(jobId, jobData = {}) {
        const exists = this.favorites.some(job => job.id === jobId);
        
        if (!exists) {
            this.favorites.push({
                id: jobId,
                ...jobData,
                savedAt: new Date().toISOString()
            });
            this.saveFavorites();
            return true;
        }
        return false;
    }

    /**
     * Remover vaga dos favoritos
     */
    removeFavorite(jobId) {
        const initialLength = this.favorites.length;
        this.favorites = this.favorites.filter(job => job.id !== jobId);
        
        if (this.favorites.length < initialLength) {
            this.saveFavorites();
            return true;
        }
        return false;
    }

    /**
     * Verificar se vaga é favorita
     */
    isFavorite(jobId) {
        return this.favorites.some(job => job.id === jobId);
    }

    /**
     * Obter todos os favoritos
     */
    getFavorites() {
        return this.favorites;
    }

    /**
     * Limpar todos os favoritos
     */
    clearFavorites() {
        this.favorites = [];
        this.saveFavorites();
    }

    /**
     * Contar favoritos
     */
    count() {
        return this.favorites.length;
    }

    /**
     * Enviar favoritos para o backend (quando integrado)
     */
    async syncWithBackend() {
        try {
            // Esta função será implementada quando o backend estiver pronto
            // POST /api/favorites com os dados dos favoritos
            console.log('Sincronizando favoritos com backend:', this.favorites);
            return true;
        } catch (error) {
            console.error('Erro ao sincronizar favoritos:', error);
            return false;
        }
    }
}

// Criar instância global de favoritos
const favoritesManager = new FavoritesManager();
