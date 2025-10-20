class SalveCrazyDoc {
    constructor() {
        this.correctPassword = 'nossomosarua';
        this.audioPlayed = false;
        this.audioEnded = false;
        this.audioEndTime = null;
        this.wrongAttempts = 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAudioPlayed();
    }

    setupEventListeners() {
        const loginBtn = document.getElementById('loginBtn');
        const passwordInput = document.getElementById('passwordInput');
        const closeModal = document.getElementById('closeModal');
        const hintModal = document.getElementById('hintModal');
        
        loginBtn.addEventListener('click', () => this.handleLogin());
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleLogin();
            }
        });
        
        closeModal.addEventListener('click', () => this.closeHintModal());
        
        // Fechar modal clicando fora dele
        hintModal.addEventListener('click', (e) => {
            if (e.target === hintModal) {
                this.closeHintModal();
            }
        });
    }

    handleLogin() {
        const passwordInput = document.getElementById('passwordInput');
        const errorMessage = document.getElementById('errorMessage');
        const password = passwordInput.value.trim();

        if (password === this.correctPassword) {
            this.showAudioScreen();
        } else {
            this.wrongAttempts++;
            
            if (this.wrongAttempts >= 2) {
                this.showHintModal();
            } else {
                errorMessage.textContent = 'Senha incorreta. Tente novamente.';
            }
            
            passwordInput.value = '';
            passwordInput.focus();
        }
    }

    showAudioScreen() {
        const loginScreen = document.getElementById('loginScreen');
        const audioScreen = document.getElementById('audioScreen');
        
        loginScreen.classList.remove('active');
        audioScreen.classList.add('active');
        
        // Iniciar reprodução automática dos áudios
        this.startAudioPlayback();
    }

    startAudioPlayback() {
        const audio1 = document.getElementById('audio1');
        const audio2 = document.getElementById('audio2');
        
        // Marcar que os áudios foram reproduzidos
        this.markAudioAsPlayed();
        
        // Configurar eventos dos áudios
        this.setupAudioEvents(audio1, 1);
        this.setupAudioEvents(audio2, 2);
        
        // Reproduzir primeiro áudio
        audio1.play().then(() => {
            console.log('Áudio 1 iniciado');
            this.updateAudioStatus(1, 'Reproduzindo...');
            this.showPlayIndicator(1);
        }).catch(error => {
            console.error('Erro ao reproduzir áudio 1:', error);
            this.updateAudioStatus(1, 'Erro ao reproduzir');
        });

        // Quando o primeiro áudio terminar, reproduzir o segundo
        audio1.addEventListener('ended', () => {
            console.log('Áudio 1 terminou');
            this.updateAudioStatus(1, 'Concluído');
            this.hidePlayIndicator(1);
            
            // Mostrar que o segundo áudio está prestes a começar
            this.updateAudioStatus(2, 'Iniciando...');
            
            // Pequeno delay antes de iniciar o segundo áudio
            setTimeout(() => {
                audio2.play().then(() => {
                    console.log('Áudio 2 iniciado');
                    this.updateAudioStatus(2, 'Reproduzindo...');
                    this.showPlayIndicator(2);
                }).catch(error => {
                    console.error('Erro ao reproduzir áudio 2:', error);
                    this.updateAudioStatus(2, 'Erro ao reproduzir');
                });
            }, 1000);
        });

        // Quando o segundo áudio terminar, iniciar sequência final
        audio2.addEventListener('ended', () => {
            console.log('Áudio 2 terminou');
            this.updateAudioStatus(2, 'Concluído');
            this.hidePlayIndicator(2);
            this.audioEnded = true;
            this.audioEndTime = Date.now();
            this.startFinalSequence();
        });
    }

    setupAudioEvents(audio, audioNumber) {
        const progressFill = document.getElementById(`progress${audioNumber}`);
        const timeDisplay = document.getElementById(`time${audioNumber}`);
        
        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                const progress = (audio.currentTime / audio.duration) * 100;
                progressFill.style.width = `${progress}%`;
                
                const currentTime = this.formatTime(audio.currentTime);
                const duration = this.formatTime(audio.duration);
                timeDisplay.textContent = `${currentTime} / ${duration}`;
            }
        });

        audio.addEventListener('loadedmetadata', () => {
            const duration = this.formatTime(audio.duration);
            timeDisplay.textContent = `0:00 / ${duration}`;
        });
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    updateAudioStatus(audioNumber, status) {
        const statusElement = document.getElementById(`status${audioNumber}`);
        statusElement.textContent = status;
    }

    showPlayIndicator(audioNumber) {
        const indicator = document.getElementById(`indicator${audioNumber}`);
        indicator.classList.add('active');
    }

    hidePlayIndicator(audioNumber) {
        const indicator = document.getElementById(`indicator${audioNumber}`);
        indicator.classList.remove('active');
    }

    showHintModal() {
        const hintModal = document.getElementById('hintModal');
        hintModal.style.display = 'flex';
    }

    closeHintModal() {
        const hintModal = document.getElementById('hintModal');
        hintModal.style.display = 'none';
    }

    startFinalSequence() {
        // Aguardar um pouco e então mostrar a tela final com efeito de piscar
        setTimeout(() => {
            this.showFinalScreen();
            this.startBlinkingEffect();
        }, 1000);
    }

    showFinalScreen() {
        const audioScreen = document.getElementById('audioScreen');
        const finalScreen = document.getElementById('finalScreen');
        
        audioScreen.classList.remove('active');
        finalScreen.classList.add('active');
    }

    startBlinkingEffect() {
        const finalScreen = document.getElementById('finalScreen');
        const finalTitle = document.getElementById('finalTitle');
        const saveDate = document.getElementById('saveDate');
        
        // Adicionar classe de piscar por 5 segundos
        finalScreen.classList.add('blinking');
        
        setTimeout(() => {
            finalScreen.classList.remove('blinking');
            // Esconder a data e mostrar SAVE THE DATE
            finalTitle.style.display = 'none';
            saveDate.style.display = 'block';
        }, 5000);
    }

    // Verificar se os áudios já foram reproduzidos neste dispositivo
    checkAudioPlayed() {
        const audioPlayed = localStorage.getItem('salveCrazyDoc_audioPlayed');
        if (audioPlayed === 'true') {
            // Se já foram reproduzidos, mostrar diretamente a tela final SEM piscar
            this.showFinalScreen();
            // Mostrar diretamente o SAVE THE DATE sem piscar
            const finalTitle = document.getElementById('finalTitle');
            const saveDate = document.getElementById('saveDate');
            finalTitle.style.display = 'none';
            saveDate.style.display = 'block';
        }
    }

    // Marcar áudios como reproduzidos
    markAudioAsPlayed() {
        localStorage.setItem('salveCrazyDoc_audioPlayed', 'true');
    }

    // Método para resetar (útil para testes)
    reset() {
        localStorage.removeItem('salveCrazyDoc_audioPlayed');
        location.reload();
    }

    // Método para limpar estado e voltar ao início
    resetToLogin() {
        localStorage.removeItem('salveCrazyDoc_audioPlayed');
        // Voltar para tela de login
        const loginScreen = document.getElementById('loginScreen');
        const audioScreen = document.getElementById('audioScreen');
        const finalScreen = document.getElementById('finalScreen');
        
        loginScreen.classList.add('active');
        audioScreen.classList.remove('active');
        finalScreen.classList.remove('active');
        
        // Resetar elementos
        const finalTitle = document.getElementById('finalTitle');
        const saveDate = document.getElementById('saveDate');
        finalTitle.style.display = 'block';
        saveDate.style.display = 'none';
        
        // Limpar campos
        const passwordInput = document.getElementById('passwordInput');
        const errorMessage = document.getElementById('errorMessage');
        passwordInput.value = '';
        errorMessage.textContent = '';
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new SalveCrazyDoc();
});

// Adicionar método de reset global para testes (remover em produção)
window.resetSalveCrazyDoc = function() {
    localStorage.removeItem('salveCrazyDoc_audioPlayed');
    location.reload();
};
