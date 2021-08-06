'use strict'

function cards() {
    let currentElement;

    function animateCard(e) {
        let target = e.target.parentNode;
        
        if (target.getAttribute('class') != cardsConfig.parentElement.getAttribute('class')) return;

        openCoverElement(target);
    }

    function openCoverElement(element) {
        if (currentElement) closeCoverElement();

        currentElement = element;
        animate({
            duration: 200,
            draw: drawAnimation,
            element: currentElement
        });
    };

    function closeCoverElement() {
        currentElement.style.opacity = 1;
        currentElement.style.top = 0;
    }

    function animate({duration, draw, element}) {
        let start = performance.now();

        requestAnimationFrame(function animate(time) {
            let timeFraction = (time - start) / duration;

            if (timeFraction > 1) timeFraction = 1;

            let progress = timeFraction;

            draw(progress, element);

            if (timeFraction < 1) requestAnimationFrame(animate);
        });
    };

    function drawAnimation(progress, element) {
        let currentPosition = 0;
        let currentOpacity = 1;

        currentPosition = currentPosition - (progress * 101);
        currentOpacity = currentOpacity - progress;
        element.style.top = currentPosition + '%';
        element.style.opacity = currentOpacity;
        
    }

    cardsConfig.elementContainer.addEventListener('click', animateCard);

};
