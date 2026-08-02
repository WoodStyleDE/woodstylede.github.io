document.addEventListener("DOMContentLoaded", () => {
    const burgerBtn = document.getElementById("burgerBtn");
    const navMenu = document.getElementById("navMenu");
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const dropdown = document.querySelector(".dropdown");

    // Универсальная функция закрытия всех меню
    function closeMenu() {
        if (navMenu) {
            navMenu.classList.remove("active");
        }
        if (burgerBtn) {
            burgerBtn.setAttribute("aria-expanded", "false");
        }
        if (dropdown) {
            dropdown.classList.remove("open");
        }
        if (dropdownToggle) {
            dropdownToggle.setAttribute("aria-expanded", "false");
        }
    }

    // Бургер-меню
    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            const isOpen = navMenu.classList.toggle("active");
            burgerBtn.setAttribute("aria-expanded", isOpen);
        });

        document.addEventListener("click", () => {
            closeMenu();
        });

        navMenu.addEventListener("click", (event) => {
            event.stopPropagation();
        });

        // Закрываем меню при клике на любую обычную ссылку
        navMenu.querySelectorAll("a").forEach(link => {
            if (!link.classList.contains("dropdown-toggle")) {
                link.addEventListener("click", closeMenu);
            }
        });
    }

    // Дропдаун Katalog на мобильных
    if (dropdownToggle && dropdown) {
        dropdownToggle.setAttribute("aria-haspopup", "true");

        dropdownToggle.addEventListener("click", (event) => {
            if (window.innerWidth <= 850) {
                event.preventDefault();
                const isOpen = dropdown.classList.toggle("open");
                dropdownToggle.setAttribute("aria-expanded", isOpen);
            }
        });
    }

    // Сброс состояний при повороте устройства или изменении размера окна
    window.addEventListener("resize", () => {
        if (window.innerWidth > 850) {
            closeMenu();
        }
    });
});