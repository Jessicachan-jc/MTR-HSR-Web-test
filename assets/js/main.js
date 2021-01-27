'use strict';

function getCurrentURLParams() {
    var params = {};
    window.location.href.split('?')[1] && window.location.href.split('?')[1].split('&').map(function (item, id) {
        var paramKeyandValue = item.split('=');
        params[paramKeyandValue[0]] = paramKeyandValue[1];
    });
    return params;
}

function searchSpecificURLParam(key) {
    var params = getCurrentURLParams();
    return params[key] ? params[key] : undefined;
}

function fontSizePreference() {
    !sessionStorage.getItem('fontSize') && sessionStorage.setItem('fontSize', 'n');
    return sessionStorage.getItem('fontSize');
}

function bodyFontSizeControl() {
    $('.size-switch .active').removeClass('active');
    $('[font-size=' + fontSizePreference() + ']').addClass('active');
    $('html').removeClass('font-size-s font-size-l');
    if (fontSizePreference() === 's') {
        $('html').addClass('font-size-s');
    } else if (fontSizePreference() === 'l') {
        $('html').addClass('font-size-l');
    }
}

function changeFontSize(size) {
    var currentFontSize = fontSizePreference();
    currentFontSize !== size ? (sessionStorage.setItem('fontSize', size), bodyFontSizeControl()) : null;
}

function languagePreference() {
    var langList = ['en', 'tc', 'sc'],
        lang = window.location.pathname.match(/\w+(?=\/)/g) ? window.location.pathname.match(/\w+(?=\/)/g)[0] : 'tc';
    return langList.indexOf(lang) > -1 ? lang : 'tc';
}

function checkActiveMenu() {
    $('.desktop-responsive .menu-list > .menu-item').each(function (index, element) {
        // currentPageUrl = location.href.match(/(\/en\/|\/tc\/|\/sc\/)(.*)(.html)/g)
        var currentPageUrl = location.href.match(/(\/en\/|\/tc\/|\/sc\/)(.*)(.html)/g);
        // console.log(currentPageUrl, $(element).find('a[href="'+ currentPageUrl +'"]'));
        if ($(element).find('a[href="' + currentPageUrl + '"]').length > 0) {
            $(this).addClass('active');
            return false;
        }
    });
    if ($('.desktop-responsive .menu-list > .menu-item.active').length <= 0) {
        $('.desktop-responsive .menu-list > .menu-item').eq(0).addClass('active');
    }
}

function generateBreadcrumb() {
    var breadcrumb = '<li><a href="' + $('.desktop-responsive .menu-list > .menu-item:first-child .main-level-item').attr('href') + '">' + $('.desktop-responsive .menu-list > .menu-item:first-child .main-level-item').text() + '</a></li>';
    var secordLevelMenuText = '';
    if ($('.desktop-responsive .menu-list > .menu-item:not(:first-child).active').length > 0) {
        secordLevelMenuText = $('.desktop-responsive .menu-list > .menu-item:not(:first-child).active .main-level-item').text();
        breadcrumb += '<li>' + $('.desktop-responsive .menu-list > .menu-item:not(:first-child).active .main-level-item').text() + '</li>';
    }
    // console.log($('.title-box > .h2').text() !== secordLevelMenuText)
    // console.log($('.title-box > .h2').text(),  secordLevelMenuText)
    if ($('.title-box > .h2').text() !== secordLevelMenuText) {
        breadcrumb += '<li>' + $('.title-box > .h2').text() + '</li>';
    }

    $('#breadcrumb').append(breadcrumb);
}

function getElementScrollTop(element) {
    return $(element).position().top + ($(element).outerHeight(true) - $(element).outerHeight());
}

function getStickyHeight() {
    return $('.content-container .sticky-content .search-bar-container').outerHeight();
}

function decimalPlace(number, decimalPlace, roundup) {
    var regex = new RegExp('(\\d*([.]\\d{0,' + decimalPlace + '}))');
    return roundup ? number.toFixed(decimalPlace) : number.toString().match(/([.])/g) ? number.toString().match(regex)[0] : number.toFixed(decimalPlace);
}

$(document).ready(function () {
    bodyFontSizeControl();
    checkActiveMenu();
    generateBreadcrumb();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZ2V0Q3VycmVudFVSTFBhcmFtcyIsInBhcmFtcyIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsInNwbGl0IiwibWFwIiwiaXRlbSIsImlkIiwicGFyYW1LZXlhbmRWYWx1ZSIsInNlYXJjaFNwZWNpZmljVVJMUGFyYW0iLCJrZXkiLCJ1bmRlZmluZWQiLCJmb250U2l6ZVByZWZlcmVuY2UiLCJzZXNzaW9uU3RvcmFnZSIsImdldEl0ZW0iLCJzZXRJdGVtIiwiYm9keUZvbnRTaXplQ29udHJvbCIsIiQiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiY2hhbmdlRm9udFNpemUiLCJzaXplIiwiY3VycmVudEZvbnRTaXplIiwibGFuZ3VhZ2VQcmVmZXJlbmNlIiwibGFuZ0xpc3QiLCJsYW5nIiwicGF0aG5hbWUiLCJtYXRjaCIsImluZGV4T2YiLCJjaGVja0FjdGl2ZU1lbnUiLCJlYWNoIiwiaW5kZXgiLCJlbGVtZW50IiwiY3VycmVudFBhZ2VVcmwiLCJmaW5kIiwibGVuZ3RoIiwiZXEiLCJnZW5lcmF0ZUJyZWFkY3J1bWIiLCJicmVhZGNydW1iIiwiYXR0ciIsInRleHQiLCJzZWNvcmRMZXZlbE1lbnVUZXh0IiwiYXBwZW5kIiwiZ2V0RWxlbWVudFNjcm9sbFRvcCIsInBvc2l0aW9uIiwidG9wIiwib3V0ZXJIZWlnaHQiLCJnZXRTdGlja3lIZWlnaHQiLCJkZWNpbWFsUGxhY2UiLCJudW1iZXIiLCJyb3VuZHVwIiwicmVnZXgiLCJSZWdFeHAiLCJ0b0ZpeGVkIiwidG9TdHJpbmciLCJkb2N1bWVudCIsInJlYWR5Il0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVNBLG1CQUFULEdBQThCO0FBQzFCLFFBQUlDLFNBQVMsRUFBYjtBQUNBQyxXQUFPQyxRQUFQLENBQWdCQyxJQUFoQixDQUFxQkMsS0FBckIsQ0FBMkIsR0FBM0IsRUFBZ0MsQ0FBaEMsS0FBc0NILE9BQU9DLFFBQVAsQ0FBZ0JDLElBQWhCLENBQXFCQyxLQUFy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T0FBUCxDQUFlTCxZQUFmLENBQVYsR0FBeUNDLE9BQU9LLFFBQVAsR0FBa0IzQixLQUFsQixDQUF3QixRQUF4QixJQUFvQ3NCLE9BQU9LLFFBQVAsR0FBa0IzQixLQUFsQixDQUF3QndCLEtBQXhCLEVBQStCLENBQS9CLENBQXBDLEdBQXdFRixPQUFPSSxPQUFQLENBQWVMLFlBQWYsQ0FBeEg7QUFDSDs7QUFFRC9CLEVBQUVzQyxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVTtBQUN4QnhDO0FBQ0FhO0FBQ0FRO0FBRUgsQ0FMRCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZ2V0Q3VycmVudFVSTFBhcmFtcygpe1xyXG4gICAgdmFyIHBhcmFtcyA9IHt9XHJcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnPycpWzFdICYmIHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCc/JylbMV0uc3BsaXQoJyYnKS5tYXAoZnVuY3Rpb24oaXRlbSwgaWQpe1xyXG4gICAgICAgIHZhciBwYXJhbUtleWFuZFZhbHVlID0gaXRlbS5zcGxpdCgnPScpXHJcbiAgICAgICAgcGFyYW1zW3BhcmFtS2V5YW5kVmFsdWVbMF1dID0gcGFyYW1LZXlhbmRWYWx1ZVsxXVxyXG4gICAgfSlcclxuICAgIHJldHVybiBwYXJhbXNcclxufVxyXG5cclxuZnVuY3Rpb24gc2VhcmNoU3BlY2lmaWNVUkxQYXJhbShrZXkpe1xyXG4gICAgdmFyIHBhcmFtcyA9IGdldEN1cnJlbnRVUkxQYXJhbXMoKVxyXG4gICAgcmV0dXJuIHBhcmFtc1trZXldID8gcGFyYW1zW2tleV0gOiB1bmRlZmluZWRcclxufVxyXG5cclxuZnVuY3Rpb24gZm9udFNpemVQcmVmZXJlbmNlKCl7XHJcbiAgICAhc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnZm9udFNpemUnKSAmJiBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdmb250U2l6ZScsICduJylcclxuICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdmb250U2l6ZScpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJvZHlGb250U2l6ZUNvbnRyb2woKXtcclxuICAgICQoJy5zaXplLXN3aXRjaCAuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAkKCdbZm9udC1zaXplPScgKyBmb250U2l6ZVByZWZlcmVuY2UoKSArICddJykuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAkKCdodG1sJykucmVtb3ZlQ2xhc3MoJ2ZvbnQtc2l6ZS1zIGZvbnQtc2l6ZS1sJylcclxuICAgIGlmKGZvbnRTaXplUHJlZmVyZW5jZSgpID09PSAncycpe1xyXG4gICAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnZm9udC1zaXplLXMnKVxyXG4gICAgfSBlbHNlIGlmKGZvbnRTaXplUHJlZmVyZW5jZSgpID09PSAnbCcpIHtcclxuICAgICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ2ZvbnQtc2l6ZS1sJylcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2hhbmdlRm9udFNpemUoc2l6ZSl7XHJcbiAgICB2YXIgY3VycmVudEZvbnRTaXplID0gZm9udFNpemVQcmVmZXJlbmNlKClcclxuICAgIGN1cnJlbnRGb250U2l6ZSAhPT0gc2l6ZSA/IChcclxuICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdmb250U2l6ZScsIHNpemUpLCBcclxuICAgICAgICBib2R5Rm9udFNpemVDb250cm9sKClcclxuICAgICkgOiBudWxsXHJcbiAgICBcclxufVxyXG5cclxuZnVuY3Rpb24gbGFuZ3VhZ2VQcmVmZXJlbmNlKCl7XHJcbiAgICB2YXIgbGFuZ0xpc3QgPSBbJ2VuJywgJ3RjJywgJ3NjJ10sXHJcbiAgICAgICAgbGFuZyA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5tYXRjaCgvXFx3Kyg/PVxcLykvZykgPyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUubWF0Y2goL1xcdysoPz1cXC8pL2cpWzBdIDogJ3RjJ1xyXG4gICAgcmV0dXJuIGxhbmdMaXN0LmluZGV4T2YobGFuZykgPiAtMSA/IGxhbmcgOiAndGMnXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrQWN0aXZlTWVudSgpe1xyXG4gICAgJCgnLmRlc2t0b3AtcmVzcG9uc2l2ZSAubWVudS1saXN0ID4gLm1lbnUtaXRlbScpLmVhY2goZnVuY3Rpb24oaW5kZXgsZWxlbWVudCl7XHJcbiAgICAgICAgLy8gY3VycmVudFBhZ2VVcmwgPSBsb2NhdGlvbi5ocmVmLm1hdGNoKC8oXFwvZW5cXC98XFwvdGNcXC98XFwvc2NcXC8pKC4qKSguaHRtbCkvZylcclxuICAgICAgICB2YXIgY3VycmVudFBhZ2VVcmwgPSBsb2NhdGlvbi5ocmVmLm1hdGNoKC8oXFwvZW5cXC98XFwvdGNcXC98XFwvc2NcXC8pKC4qKSguaHRtbCkvZyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coY3VycmVudFBhZ2VVcmwsICQoZWxlbWVudCkuZmluZCgnYVtocmVmPVwiJysgY3VycmVudFBhZ2VVcmwgKydcIl0nKSk7XHJcbiAgICAgICAgaWYoJChlbGVtZW50KS5maW5kKCdhW2hyZWY9XCInKyBjdXJyZW50UGFnZVVybCArJ1wiXScpLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICBpZigkKCcuZGVza3RvcC1yZXNwb25zaXZlIC5tZW51LWxpc3QgPiAubWVudS1pdGVtLmFjdGl2ZScpLmxlbmd0aCA8PSAwICl7XHJcbiAgICAgICAgJCgnLmRlc2t0b3AtcmVzcG9uc2l2ZSAubWVudS1saXN0ID4gLm1lbnUtaXRlbScpLmVxKDApLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVCcmVhZGNydW1iKCl7XHJcbiAgICB2YXIgYnJlYWRjcnVtYiA9ICc8bGk+PGEgaHJlZj1cIicrJCgnLmRlc2t0b3AtcmVzcG9uc2l2ZSAubWVudS1saXN0ID4gLm1lbnUtaXRlbTpmaXJzdC1jaGlsZCAubWFpbi1sZXZlbC1pdGVtJykuYXR0cignaHJlZicpKydcIj4nKyAkKCcuZGVza3RvcC1yZXNwb25zaXZlIC5tZW51LWxpc3QgPiAubWVudS1pdGVtOmZpcnN0LWNoaWxkIC5tYWluLWxldmVsLWl0ZW0nKS50ZXh0KCkgKyc8L2E+PC9saT4nO1xyXG4gICAgdmFyIHNlY29yZExldmVsTWVudVRleHQgPSAnJztcclxuICAgIGlmKCQoJy5kZXNrdG9wLXJlc3BvbnNpdmUgLm1lbnUtbGlzdCA+IC5tZW51LWl0ZW06bm90KDpmaXJzdC1jaGlsZCkuYWN0aXZlJykubGVuZ3RoID4gMCApe1xyXG4gICAgICAgIHNlY29yZExldmVsTWVudVRleHQgPSAgJCgnLmRlc2t0b3AtcmVzcG9uc2l2ZSAubWVudS1saXN0ID4gLm1lbnUtaXRlbTpub3QoOmZpcnN0LWNoaWxkKS5hY3RpdmUgLm1haW4tbGV2ZWwtaXRlbScpLnRleHQoKTtcclxuICAgICAgICBicmVhZGNydW1iICs9ICc8bGk+JyskKCcuZGVza3RvcC1yZXNwb25zaXZlIC5tZW51LWxpc3QgPiAubWVudS1pdGVtOm5vdCg6Zmlyc3QtY2hpbGQpLmFjdGl2ZSAubWFpbi1sZXZlbC1pdGVtJykudGV4dCgpKyc8L2xpPic7XHJcbiAgICB9XHJcbiAgICAvLyBjb25zb2xlLmxvZygkKCcudGl0bGUtYm94ID4gLmgyJykudGV4dCgpICE9PSBzZWNvcmRMZXZlbE1lbnVUZXh0KVxyXG4gICAgLy8gY29uc29sZS5sb2coJCgnLnRpdGxlLWJveCA+IC5oMicpLnRleHQoKSwgIHNlY29yZExldmVsTWVudVRleHQpXHJcbiAgICBpZiggJCgnLnRpdGxlLWJveCA+IC5oMicpLnRleHQoKSAhPT0gc2Vjb3JkTGV2ZWxNZW51VGV4dCl7XHJcbiAgICAgICAgYnJlYWRjcnVtYiArPSAnPGxpPicrJCgnLnRpdGxlLWJveCA+IC5oMicpLnRleHQoKSsnPC9saT4nO1xyXG4gICAgfVxyXG5cclxuICAgICQoJyNicmVhZGNydW1iJykuYXBwZW5kKGJyZWFkY3J1bWIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRFbGVtZW50U2Nyb2xsVG9wKGVsZW1lbnQpe1xyXG4gICAgcmV0dXJuICQoZWxlbWVudCkucG9zaXRpb24oKS50b3AgKyAoJChlbGVtZW50KS5vdXRlckhlaWdodCh0cnVlKSAtICQoZWxlbWVudCkub3V0ZXJIZWlnaHQoKSlcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U3RpY2t5SGVpZ2h0KCl7XHJcbiAgICByZXR1cm4gJCgnLmNvbnRlbnQtY29udGFpbmVyIC5zdGlja3ktY29udGVudCAuc2VhcmNoLWJhci1jb250YWluZXInKS5vdXRlckhlaWdodCgpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlY2ltYWxQbGFjZShudW1iZXIsIGRlY2ltYWxQbGFjZSwgcm91bmR1cCl7XHJcbiAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKCcoXFxcXGQqKFsuXVxcXFxkezAsJyArIGRlY2ltYWxQbGFjZSArICd9KSknKVxyXG4gICAgcmV0dXJuIHJvdW5kdXAgPyBudW1iZXIudG9GaXhlZChkZWNpbWFsUGxhY2UpIDogbnVtYmVyLnRvU3RyaW5nKCkubWF0Y2goLyhbLl0pL2cpID8gbnVtYmVyLnRvU3RyaW5nKCkubWF0Y2gocmVnZXgpWzBdIDogbnVtYmVyLnRvRml4ZWQoZGVjaW1hbFBsYWNlKVxyXG59XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICAgYm9keUZvbnRTaXplQ29udHJvbCgpXHJcbiAgICBjaGVja0FjdGl2ZU1lbnUoKVxyXG4gICAgZ2VuZXJhdGVCcmVhZGNydW1iKClcclxuICAgIFxyXG59KVxyXG4iXX0=
