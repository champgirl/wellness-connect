<template>
    <div class="login">
        <img src="/images/login-bg.webp" alt="login image" class="login__img">

        <form action="" class="login__form">
            <h1 class="login__title">Student Register</h1>

            <div class="login__content">
                <div class="login__box">
                    <i class="ri-user-3-line login__icon"></i>

                    <div class="login__box-input">
                        <input type="text" required class="login__input" id="name" placeholder=" ">
                        <label for="name" class="login__label">Name</label>
                    </div>
                </div>

                <div class="login__box">
                    <i class="ri-user-3-line login__icon"></i>

                    <div class="login__box-input">
                        <input type="email" required class="login__input" id="login-email" placeholder=" ">
                        <label for="login-email" class="login__label">Email</label>
                    </div>
                </div>

                <div class="login__box">
                    <i class="ri-user-3-line login__icon"></i>

                    <div class="login__box-input">
                        <input type="email" required class="login__input" id="registration" placeholder=" ">
                        <label for="registration" class="login__label">Registration Number</label>
                    </div>
                </div>

                <div class="login__box">
                    <i class="ri-user-3-line login__icon"></i>

                    <div class="login__box-input">
                        <input type="tel" required class="login__input" id="contact" placeholder=" ">
                        <label for="contact" class="login__label">Contact</label>
                    </div>
                </div>


                <div class="login__box">
                    <i class="ri-lock-2-line login__icon"></i>

                    <div class="login__box-input">
                        <input type="password" required class="login__input" id="login-pass" placeholder=" ">
                        <label for="login-pass" class="login__label">Password</label>
                        <i class="ri-eye-off-line login__eye" id="login-eye"></i>
                    </div>
                </div>
            </div>

            <button type="submit" class="login__button">Sign Up</button>
        </form>
    </div>
</template>
<script setup lang="ts">
onMounted(() => {
    const showHiddenPass = (loginPass: string, loginEye: string) => {
        const input = document.getElementById(loginPass) as any,
            iconEye = document.getElementById(loginEye)

        iconEye?.addEventListener('click', () => {
            if (!input) return;

            if (input.type === 'password') {
                input.type = 'text'
                iconEye.classList.add('ri-eye-line')
                iconEye.classList.remove('ri-eye-off-line')
            } else {
                input.type = 'password'
                iconEye.classList.remove('ri-eye-line')
                iconEye.classList.add('ri-eye-off-line')
            }
        })
    }

    showHiddenPass('login-pass', 'login-eye')
})
</script>