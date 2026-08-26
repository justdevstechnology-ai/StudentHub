/* =========================================================
   STUDENTHUB — LANDING PAGE
   Landing page interactions
   ========================================================= */

(() => {
    "use strict";

    /* =====================================================
       HELPERS
       ===================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];


    /* =====================================================
       DOM
       ===================================================== */

    const header = $(".site-header");
    const menuToggle = $(".mobile-menu-toggle");
    const navLinks = $(".nav-links");
    const backToTop = $(".back-to-top");

    const courseSearch =
        $(".hero-search input");

    const courseSearchButton =
        $(".hero-search button");

    const courseCards =
        $$(".course-card");

    const filterButtons =
        $$(".filter-btn");


    /* =====================================================
       HEADER SCROLL STATE
       ===================================================== */

    const updateHeader = () => {
        if (!header) return;

        header.classList.toggle(
            "scrolled",
            window.scrollY > 20
        );

        if (backToTop) {
            backToTop.classList.toggle(
                "visible",
                window.scrollY > 500
            );
        }
    };

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );


    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    const closeMobileMenu = () => {
        if (!navLinks || !menuToggle) return;

        navLinks.classList.remove("open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.classList.remove(
            "menu-open"
        );
    };

    const openMobileMenu = () => {
        if (!navLinks || !menuToggle) return;

        navLinks.classList.add("open");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        document.body.classList.add(
            "menu-open"
        );
    };

    if (menuToggle && navLinks) {
        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.addEventListener(
            "click",
            () => {
                const isOpen =
                    navLinks.classList.contains(
                        "open"
                    );

                if (isOpen) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            }
        );
    }


    /* =====================================================
       CLOSE MOBILE MENU ON LINK CLICK
       ===================================================== */

    $$(".nav-link").forEach((link) => {
        link.addEventListener(
            "click",
            () => {
                closeMobileMenu();
            }
        );
    });


    /* =====================================================
       CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
       ===================================================== */

    document.addEventListener(
        "click",
        (event) => {
            if (
                !navLinks ||
                !menuToggle ||
                !navLinks.classList.contains("open")
            ) {
                return;
            }

            const target = event.target;

            if (
                navLinks.contains(target) ||
                menuToggle.contains(target)
            ) {
                return;
            }

            closeMobileMenu();
        }
    );


    /* =====================================================
       ESCAPE KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {
            if (event.key !== "Escape") return;

            closeMobileMenu();
        }
    );


    /* =====================================================
       RESET MOBILE NAV ON RESIZE
       ===================================================== */

    window.addEventListener(
        "resize",
        () => {
            if (
                window.innerWidth > 820
            ) {
                closeMobileMenu();
            }
        }
    );


    /* =====================================================
       SMOOTH ANCHOR NAVIGATION
       ===================================================== */

    $$('a[href^="#"]').forEach((link) => {
        link.addEventListener(
            "click",
            (event) => {
                const href =
                    link.getAttribute("href");

                if (
                    !href ||
                    href === "#"
                ) {
                    return;
                }

                const target =
                    $(href);

                if (!target) return;

                event.preventDefault();

                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;

                const targetTop =
                    target.getBoundingClientRect()
                        .top +
                    window.scrollY -
                    headerHeight -
                    15;

                window.scrollTo({
                    top:
                        Math.max(
                            targetTop,
                            0
                        ),
                    behavior: "smooth"
                });

                closeMobileMenu();
            }
        );
    });


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealElements =
        $$("[data-reveal]");

    if (
        revealElements.length &&
        "IntersectionObserver" in window
    ) {
        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach(
                        (entry) => {
                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            entry.target.classList.add(
                                "is-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }
                    );
                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );

        revealElements.forEach(
            (element) => {
                revealObserver.observe(
                    element
                );
            }
        );
    } else {
        revealElements.forEach(
            (element) => {
                element.classList.add(
                    "is-visible"
                );
            }
        );
    }


    /* =====================================================
       STAGGER CARD ANIMATIONS
       ===================================================== */

    const staggerGroups = [
        ".quick-grid .quick-card",
        ".course-grid .course-card",
        ".resources-grid .resource-card",
        ".testimonials-grid .testimonial",
        ".steps-grid .step"
    ];

    staggerGroups.forEach(
        (selector) => {
            $$(selector).forEach(
                (element, index) => {
                    element.style.transitionDelay =
                        `${Math.min(index * 70, 350)}ms`;
                }
            );
        }
    );


    /* =====================================================
       COURSE SEARCH
       ===================================================== */

    const normalize = (value) =>
        String(value || "")
            .trim()
            .toLowerCase();

    const getCourseText = (card) =>
        normalize(
            [
                card.dataset.course,
                card.dataset.department,
                card.dataset.level,
                $(".course-title", card)?.textContent,
                $(".course-description", card)?.textContent,
                $(".course-department", card)?.textContent
            ].join(" ")
        );

    const filterCourses = () => {
        if (!courseCards.length) return;

        const query =
            normalize(
                courseSearch?.value
            );

        const activeFilter =
            $(".filter-btn.active");

        const category =
            normalize(
                activeFilter?.dataset.filter
            );

        let visibleCount = 0;

        courseCards.forEach(
            (card) => {
                const text =
                    getCourseText(card);

                const cardCategory =
                    normalize(
                        card.dataset.category
                    );

                const matchesSearch =
                    !query ||
                    text.includes(query);

                const matchesCategory =
                    !category ||
                    category === "all" ||
                    cardCategory === category ||
                    text.includes(category);

                const visible =
                    matchesSearch &&
                    matchesCategory;

                card.hidden = !visible;

                if (visible) {
                    visibleCount++;
                }
            }
        );

        updateEmptyCourseState(
            visibleCount
        );
    };


    /* =====================================================
       COURSE EMPTY STATE
       ===================================================== */

    const updateEmptyCourseState = (
        visibleCount
    ) => {
        const grid =
            $(".course-grid");

        if (!grid) return;

        let emptyState =
            $(".course-empty-state");

        if (visibleCount > 0) {
            if (emptyState) {
                emptyState.remove();
            }

            return;
        }

        if (emptyState) return;

        emptyState =
            document.createElement("div");

        emptyState.className =
            "course-empty-state";

        emptyState.style.gridColumn =
            "1 / -1";

        emptyState.style.padding =
            "45px 20px";

        emptyState.style.textAlign =
            "center";

        emptyState.innerHTML = `
            <span
                class="material-symbols-rounded"
                style="
                    font-size:36px;
                    color:#7b8797;
                    opacity:.7;
                "
            >
                search_off
            </span>

            <h3
                style="
                    margin:12px 0 5px;
                    color:#071426;
                    font-size:16px;
                "
            >
                No courses found
            </h3>

            <p
                style="
                    margin:0;
                    color:#7b8797;
                    font-size:11px;
                "
            >
                Try another course name,
                department, or category.
            </p>
        `;

        grid.appendChild(
            emptyState
        );
    };


    if (courseSearch) {
        courseSearch.addEventListener(
            "input",
            filterCourses
        );

        courseSearch.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key === "Enter"
                ) {
                    event.preventDefault();

                    filterCourses();

                    const coursesSection =
                        $("#courses");

                    coursesSection?.scrollIntoView(
                        {
                            behavior: "smooth",
                            block: "start"
                        }
                    );
                }
            }
        );
    }

    if (courseSearchButton) {
        courseSearchButton.addEventListener(
            "click",
            () => {
                filterCourses();

                const coursesSection =
                    $("#courses");

                coursesSection?.scrollIntoView(
                    {
                        behavior: "smooth",
                        block: "start"
                    }
                );
            }
        );
    }


    /* =====================================================
       COURSE FILTER BUTTONS
       ===================================================== */

    filterButtons.forEach(
        (button) => {
            button.addEventListener(
                "click",
                () => {
                    filterButtons.forEach(
                        (item) => {
                            item.classList.remove(
                                "active"
                            );

                            item.setAttribute(
                                "aria-selected",
                                "false"
                            );
                        }
                    );

                    button.classList.add(
                        "active"
                    );

                    button.setAttribute(
                        "aria-selected",
                        "true"
                    );

                    filterCourses();
                }
            );
        }
    );


    /* =====================================================
       BACK TO TOP
       ===================================================== */

    if (backToTop) {
        backToTop.addEventListener(
            "click",
            () => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );
    }


    /* =====================================================
       ACTIVE NAV SECTION
       ===================================================== */

    const sections =
        $$("main section[id]");

    const navigationLinks =
        $$(".nav-link[href^='#']");

    if (
        sections.length &&
        navigationLinks.length &&
        "IntersectionObserver" in window
    ) {
        const sectionObserver =
            new IntersectionObserver(
                (entries) => {
                    entries.forEach(
                        (entry) => {
                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            const id =
                                entry.target.id;

                            navigationLinks.forEach(
                                (link) => {
                                    const active =
                                        link.getAttribute(
                                            "href"
                                        ) ===
                                        `#${id}`;

                                    link.classList.toggle(
                                        "active",
                                        active
                                    );
                                }
                            );
                        }
                    );
                },
                {
                    threshold: 0.2,
                    rootMargin:
                        "-20% 0px -60% 0px"
                }
            );

        sections.forEach(
            (section) => {
                sectionObserver.observe(
                    section
                );
            }
        );
    }


    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    $$("[data-current-year]")
        .forEach((element) => {
            element.textContent =
                new Date().getFullYear();
        });


    /* =====================================================
       BUTTON LOADING STATE
       ===================================================== */

    const setButtonLoading = (
        button,
        loading
    ) => {
        if (!button) return;

        if (loading) {
            if (
                button.dataset.originalContent ===
                undefined
            ) {
                button.dataset.originalContent =
                    button.innerHTML;
            }

            button.disabled = true;

            button.innerHTML = `
                <span
                    class="material-symbols-rounded"
                    style="
                        animation:
                            landingSpin .8s linear infinite;
                    "
                >
                    progress_activity
                </span>
                Loading...
            `;
        } else {
            button.disabled = false;

            if (
                button.dataset.originalContent !==
                undefined
            ) {
                button.innerHTML =
                    button.dataset.originalContent;
            }
        }
    };

    /*
     * Keep this helper available for future
     * authentication/API integration.
     */
    window.CapsuleLanding = {
        filterCourses,
        closeMobileMenu,
        setButtonLoading
    };


    /* =====================================================
       DYNAMIC SPINNER ANIMATION
       ===================================================== */

    if (
        !document.getElementById(
            "landing-spin-style"
        )
    ) {
        const style =
            document.createElement("style");

        style.id =
            "landing-spin-style";

        style.textContent = `
            @keyframes landingSpin {
                from {
                    transform: rotate(0deg);
                }

                to {
                    transform: rotate(360deg);
                }
            }

            .btn:disabled {
                cursor: wait;
                opacity: .7;
                transform: none !important;
            }
        `;

        document.head.appendChild(
            style
        );
    }


    /* =====================================================
       INITIAL COURSE STATE
       ===================================================== */

    filterCourses();


    /* =====================================================
       PAGE READY
       ===================================================== */

    document.documentElement.classList.add(
        "landing-ready"
    );

})();
