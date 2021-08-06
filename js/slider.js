'use strict'

function slider() {
    const maxAnimationTime = 200; // Время, которое должна длиться анимация
    const timePerFrame = 6; // Время на одну перерисовку

    const startElementTranslation = 100; // Начальная позиция слайдов в пикселях со сдвигом left = elementTranslation или right = elementTranslation

    let currentSlide = 0; // Глобальная переменная с индексом текущего слайда

    const uiElements = {
        prevBtn: document.querySelector('#sliderPrevBtn'),
        nextBtn: document.querySelector('#sliderNextBtn'),
        slides: document.getElementsByClassName('text-slider-block-1'),
    };

    uiElements.slides[currentSlide].style.display = 'block'; // Устанавливаем значение display = block для первого слайда
    uiElements.slides[currentSlide].style.opacity = 1;

    function clickNextBtn(c_slide) {
        c_slide++;

        if (c_slide > uiElements.slides.length - 1) c_slide = 0;

        return c_slide;
    }

    function clickPrevBtn(c_slide) {
        c_slide--;

        if (c_slide < 0) c_slide = uiElements.slides.length - 1;

        return c_slide;
    }

    /**Принимает в качестве аргумента функцию переключения слайда
     * clickNextBtn(currentSlide)
     * clickPrevBtn(currentSlide)
     */
    function changeSlide(elementId, switchSlideFn) {

        let previousSlide = currentSlide;

        currentSlide = switchSlideFn(currentSlide);

        uiElements.slides[currentSlide].style.display = 'block';

        /**Запуск анимации
         * duration - длительность анимации
         * timing - равномерность анимации
         * draw - функция отрисовки анимации
         * element - текущий слайд, на который переключились
         * prevElement - слайд, с которого переключились
         * clickElementId - id элемента (кнопки) для определения направления анимации
         */

        animate({
            duration: 200,
            timing: function(timeFraction) {
                return timeFraction;
            },
            draw: drawAnimation, 
            element: uiElements.slides[currentSlide],
            prevElement: uiElements.slides[previousSlide],
            clickElementId: elementId,
        });
    }

    /**Отрисовка анимации каждый кадр.
     * progress - вычисленная переменная функцией timing(),
     * slide, prevSlide - слайды для анимирования,
     * moveDirection - направление анимации.
     */

    function drawAnimation(progress, slide, prevSlide, moveDirection) {
        let currentPosition = startElementTranslation;
        let currentOpacityPrevSlide = 1;

        slide.style.opacity = progress;
        currentOpacityPrevSlide = currentOpacityPrevSlide - progress;
        
        if (currentOpacityPrevSlide < 0) currentOpacityPrevSlide = 0;

        prevSlide.style.opacity = currentOpacityPrevSlide;
        
        currentPosition = currentPosition - (progress * 100);

        if (moveDirection === 'right') {
            slide.style.left = currentPosition + 'px';
            prevSlide.style.left = -currentPosition + 'px';
            prevSlide.style.top = currentPosition + 'px';
        } else if (moveDirection === 'left') {
            slide.style.left = -currentPosition + 'px';
            prevSlide.style.left = currentPosition + 'px';
            prevSlide.style.top = currentPosition + 'px';
        }
    }

    function animate({duration, draw, timing, element, prevElement, clickElementId}) {
        let start = performance.now();
        let moveDir = 'right'; // По умолчанию, движение анимации осуществляется слева направо

        /**Определение направления в зависимости от кнопки */
        if (clickElementId == uiElements.nextBtn.getAttribute('id')) {
            uiElements.slides[currentSlide].style.left = startElementTranslation + 'px';
            moveDir = 'right';
        } else if (clickElementId == uiElements.prevBtn.getAttribute('id')) {
            uiElements.slides[currentSlide].style.left = -startElementTranslation + 'px';
            moveDir = 'left';
        }

        /**Для планирования перерисовки анимации. Function animate - коллбэк,
         * вызываемой перед перерисовкой.
         */
        requestAnimationFrame(function animate(time) {
            let timeFraction = (time - start) / duration;

            if (timeFraction > 1) {
                prevElement.style.display = 'none';
                timeFraction = 1;
            }

            let progress = timing(timeFraction);

            draw(progress, element, prevElement, moveDir);

            if (timeFraction < 1) requestAnimationFrame(animate);
        });
    }

    uiElements.prevBtn.addEventListener('click', (e) => {changeSlide(e.currentTarget.getAttribute('id'), clickPrevBtn)});
    uiElements.nextBtn.addEventListener('click', (e) => {changeSlide(e.currentTarget.getAttribute('id'), clickNextBtn)});
};