<div class="spinner-container">
    <img class="spinner-logo"
         src="/images/mix-mini-logo.png"
         alt="mix-logo" />
</div>

<style>
    .spinner-container {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .spinner-logo {
        width: 70px !important;
        animation: spinnerRotate 3s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    @keyframes spinnerRotate {
        0%   {
            transform: rotateZ(0deg);
        }
        25%  {
            transform: rotateZ(72deg) scale(1.3);
        }
        50% {
            transform: rotateZ(180deg);
        }
        75% {
            transform: rotateZ(288deg) scale(1.3);
        }
        100%  {
            transform: rotateZ(360deg);
        }
    }
</style>