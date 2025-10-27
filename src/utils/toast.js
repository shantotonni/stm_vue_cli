// Toast notification utility
class Toast {
    constructor() {
        this.container = null
        this.init()
    }

    init() {
        this.container = document.createElement('div')
        this.container.className = 'toast-container fixed top-4 right-4 z-50 space-y-2'
        document.body.appendChild(this.container)
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div')
        toast.className = `toast-item transform transition-all duration-300 translate-x-0 opacity-100 ${this.getToastClass(type)}`

        toast.innerHTML = `
            <div class="flex items-center gap-3 p-4 rounded-lg shadow-lg max-w-md">
                <i class="${this.getIcon(type)} text-xl"></i>
                <p class="flex-1 text-sm font-medium">${message}</p>
                <button class="toast-close text-lg opacity-70 hover:opacity-100">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `

        this.container.appendChild(toast)

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.remove(toast)
        })

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.remove(toast)
            }, duration)
        }
    }

    remove(toast) {
        toast.style.transform = 'translateX(400px)'
        toast.style.opacity = '0'
        setTimeout(() => {
            toast.remove()
        }, 300)
    }

    getToastClass(type) {
        const classes = {
            success: 'bg-green-600 text-white',
            error: 'bg-red-600 text-white',
            warning: 'bg-yellow-600 text-white',
            info: 'bg-blue-600 text-white'
        }
        return classes[type] || classes.info
    }

    getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-times-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        }
        return icons[type] || icons.info
    }

    success(message, duration) {
        this.show(message, 'success', duration)
    }

    error(message, duration) {
        this.show(message, 'error', duration)
    }

    warning(message, duration) {
        this.show(message, 'warning', duration)
    }

    info(message, duration) {
        this.show(message, 'info', duration)
    }
}

export default new Toast()