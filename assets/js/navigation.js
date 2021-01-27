'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

$(document).ready(function () {
    //navigation
    //desktop submenu
    $('.main-level-item').on('focus mouseenter', function () {
        $('.active-sub-level').removeClass('active-sub-level');
        $(this).parents('.menu-item').addClass('active-sub-level');
        $('.active-sub-level').find('.level-2-menu-item').slideUp(1).slideDown(200);
    }).on('mouseleave', function () {
        $('.active-sub-level').removeClass('active-sub-level');
    });
    $(document).on('touchstart', function (e) {
        if (document.getElementsByClassName('active-sub-level').length > 0 && e.targetTouches[0].pageY > $('.active-sub-level .level-2-menu-item').offset().top + $('.active-sub-level .level-2-menu-item').height()) {
            $('.active-sub-level').removeClass('active-sub-level');
        }
    });
    manipulateLevel2Item();
    initFontSizeButton();

    //mobile menu
    $('.menu-layer').on('click', function () {
        $('.mobile-menu-container').hasClass('active') && $('.mobile-menu-container').removeClass('active');
        $('body').hasClass('mobile-menu-active') && $('body').removeClass('mobile-menu-active');
        collapseMenuItem();
    });
    $('.menu-button').on('click', function () {
        $('.mobile-menu-container').addClass('active');
        $('body').addClass('mobile-menu-active');
    });
    $('.mobile-menu-container .sub-menu .menu-item-title').on('click', function () {
        $(this).parent().hasClass('active') ? $(this).parent().removeClass('active') : $(this).parent().addClass('active');
    });
    //mobile trip planner
    $('.trip-planner-button').on('click', function () {
        var tripPlanner = $('.mobile-responsive .trip-planner-search-bar');
        if (tripPlanner.hasClass('active')) {
            tripPlanner.slideUp().removeClass('active');
        } else {
            tripPlanner.slideDown().addClass('active');
        }
    });

    // trip planner search bar init
    if ((typeof tripPlannerData === 'undefined' ? 'undefined' : _typeof(tripPlannerData)) != 'object' || Object.keys(tripPlannerData) === 0) {
        $.ajax({
            method: 'GET',
            url: trip_planner_api
        }).then(function (data) {
            tripPlannerData = data;
            initDropdown();
        });
    }
    //select onchange
    $('.trip-planner-select-container .destination .dropdown').on('change', function () {
        var start = $(this).parents('.trip-planner-select-container').find('.destination .dropdown').first().val(),
            end = $(this).parents('.trip-planner-select-container').find('.destination .dropdown').last().val();
        //change the other dropdown value to WEK
        $(this).parents('.destination').is(':first-child') && $('.trip-planner-select-container .dropdown').last().val("WEK");
        // enable search button
        start && end ? $(this).parents('.search-bar-container').find('.search-button').attr('disabled', false) : $(this).parents('.search-bar-container').find('.search-button').attr('disabled', true);
    });
    //switch select value
    $('.trip-planner-select-container .trip-planner-switch').on('click', function () {
        var destionation1 = $($(this).parent().siblings('.destination')[0]).find('.dropdown').val(),
            destionation2 = $($(this).parent().siblings('.destination')[1]).find('.dropdown').val();
        $($(this).parent().siblings('.destination')[0]).find('.dropdown').val(destionation2);
        $($(this).parent().siblings('.destination')[1]).find('.dropdown').val(destionation1);
    });
    //search result button
    $('.search-button').on('click', function () {
        var start = $(this).siblings('.trip-planner-select-container').find('.destination .dropdown').first().val(),
            end = $(this).siblings('.trip-planner-select-container').find('.destination .dropdown').last().val(),
            routeResult = findRouteResult(start, end);
        tripSearchValidation(start, end, routeResult, function () {
            window.location = "/" + lang + '/trip-planner.html?id=' + routeResult;
        });
    });
    //search bar validation
    function tripSearchValidation(start, end, routeResult, callback) {
        var validated = true,
            tripPlannerErrorMessage = {
            differentRoute: {
                en: 'Please select a different station.',
                tc: '請選擇不同車站。',
                sc: '请选择不同车站。'
            },
            mustbeWEK: {
                en: 'Please select West Kowloon Station as the departure/arrival station.',
                tc: '請選擇香港西九龍為起點/終點。',
                sc: '请选择香港西九龙为起点/终点。'
            },
            noRouteFound: {
                en: 'The train number does not exist. Please select another one.',
                tc: '所選列車並不存在，請重新選擇。',
                sc: '所选列车并不存在，请重新选择。'
            }
        };
        if (validated && start === end) {
            validated = false;
            window.alert(tripPlannerErrorMessage.differentRoute[lang]);
        }
        if (validated && !(start === "WEK" || end === "WEK")) {
            validated = false;
            window.alert(tripPlannerErrorMessage.mustbeWEK[lang]);
        }
        if (validated && findRouteResult(start, end) === undefined) {
            validated = false;
            window.alert(tripPlannerErrorMessage.noRouteFound[lang]);
        }
        if (validated) {
            callback(routeResult);
        }
    }
    //init search bar dropdown
    function initDropdown() {
        var optionHtml = '',
            paramId = searchSpecificURLParam('id'),
            result,
            sorted = tripPlannerData.station.sort(function (a, b) {
            return a['order_' + lang] - b['order_' + lang];
        }),
            altered = {},
            wekStation = tripPlannerData.station.filter(function (item, id) {
            return item.station_id == "WEK";
        })[0];
        paramId = paramId ? paramId.replace(/([^a-zA-Z1-9])/g, '') : paramId;
        result = searchWithRoute(paramId, 'route_result');
        tripPlannerData.station_type.map(function (item, id) {
            altered[item.type_id] = [];
        });
        tripPlannerData.station.map(function (item, id) {
            altered[item.type_id].push(item);
        });
        for (var key in altered) {
            var categoryHTML = '<option disabled>一一 ' + getCategoryText(key)['type_' + lang] + ' 一一</option>';
            optionHtml = optionHtml + categoryHTML;
            altered[key].map(function (item, id) {
                var html = '<option value="' + item.station_id + '">' + item['station_title_' + lang] + '</option>';
                optionHtml = optionHtml + html;
            });
        }
        $('.trip-planner-select-container .destination .dropdown').append(optionHtml);
        // debugger
        result ? ($('.trip-planner-select-container .destination:first-child .dropdown').val(result['start_id']), $('.trip-planner-select-container .destination:last-child .dropdown').val(result['dest_id']), $('.search-button').attr('disabled', false)) : $('.trip-planner-select-container .destination:first-child .dropdown').val(wekStation.station_id);
    }
    //find route result
    function findRouteResult(start, destination) {
        var routeResult = tripPlannerData.route_result.filter(function (item, id) {
            return item.start_id === start && item.dest_id === destination;
        });
        return routeResult.length > 0 ? routeResult[0]['route_id'] : undefined;
    }
    //tnx
    tnx_connect();

    function manipulateLevel2Item() {
        var blockItem;
        $.map($('.level-2-item-block'), function (item, id) {
            blockItem = item;
            $.map($(blockItem).find('.level-2-sub-menu'), function (item, id) {
                if (id % 3 === 0) {
                    $(blockItem).append('<span class="level-2-item-row"></span>');
                }
                $(blockItem).find('.level-2-item-row:last-child').append(item);
            });
        });
    }

    function collapseMenuItem() {
        setTimeout(function () {
            $('.mobile-menu-container.active').removeClass('active');
        }, 500);
    }

    function initFontSizeButton() {
        $($('.size-switch [font-size]')).on('click', function () {
            changeFontSize($(this).attr('font-size'));
        });
    }

    function tnx_connect() {
        $.ajax({
            method: 'GET',
            url: tnx_api,
            crossDomain: true
        }).then(function (data) {
            var messages = data.messages,
                displayInfoMessage = {
                tc: '最新服務資訊',
                sc: '最新服务资讯',
                en: 'Latest Service Update'
            },
                displayAlertMessage = {
                tc: '最新服務資訊',
                sc: '最新服务资讯',
                en: 'Latest Service Update'
            },
                showMessage = function showMessage(type) {
                    if(type=='alert'){
                        $('.traffic-news').addClass(type).find('.message').attr('href', messages[0]['url_' + lang]).find('.content-wrapper').text(displayAlertMessage[lang]);
                    }
                    else{
                        $('.traffic-news').addClass(type).find('.message').attr('href', messages[0]['url_' + lang]).find('.content-wrapper').text(displayInfoMessage[lang]);
                    }       
            };
            if (messages.length > 0) {
                // messages.sort(function(a, b){
                //     if(a.category == 1 || a.category == 3){
                //         return 1
                //     }
                //     return parseInt(a.category) > parseInt(b.category)
                // })
                var filteredMessage = messages.filter(function (item, id) {
                    return item.category == 1 || item.category == 3;
                });
                if (filteredMessage.length > 0) {
                    showMessage('alert');
                } else {
                    showMessage('information');
                }
            }
        });
    }

    function getCategoryText(categoryKey) {
        return tripPlannerData.station_type.filter(function (item, id) {
            return item.type_id === categoryKey;
        })[0];
    }
});

if (!tripPlannerData) {
    var tripPlannerData;
}

var lang = languagePreference();
//search route
function searchWithRoute(routeId, key) {
    return tripPlannerData[key].filter(function (item, id) {
        return item.route_id === routeId;
    })[0];
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5hdmlnYXRpb24uanMiXSwibmFtZXMiOlsiJCIsImRvY3VtZW50IiwicmVhZHkiLCJvbiIsInJlbW92ZUNsYXNzIiwicGFyZW50cyIsImFkZENsYXNzIiwiZmluZCIsInNsaWRlVXAiLCJzbGlkZURvd24iLCJlIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImxlbmd0aCIsInRhcmdldFRvdWNoZXMiLCJwYWdlWSIsIm9mZnNldCIsInRvcCIsImhlaWdodCIsIm1hbmlwdWxhdGVMZXZlbDJJdGVtIiwiaW5pdEZvbnRTaXplQnV0dG9uIiwiaGFzQ2xhc3MiLCJjb2xsYXBzZU1lbnVJdGVtIiwicGFyZW50IiwidHJpcFBsYW5uZXIiLCJ0cmlwUGxhbm5lckRhdGEiLCJPYmplY3QiLCJrZXlzIiwiYWpheCIsIm1ldGhvZCIsInVybCIsInRyaXBfcGxhbm5lcl9hcGkiLCJ0aGVuIiwiZGF0YSIsImluaXREcm9wZG93biIsInN0YXJ0IiwiZmlyc3QiLCJ2YWwiLCJlbmQiLCJsYXN0IiwiaXMiLCJhdHRyIiwiZGVzdGlvbmF0aW9uMSIsInNpYmxpbmdzIiwiZGVzdGlvbmF0aW9uMiIsInJvdXRlUmVzdWx0IiwiZmluZFJvdXRlUmVzdWx0IiwidHJpcFNlYXJjaFZhbGlkYXRpb24iLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImxhbmciLCJjYWxsYmFjayIsInZhbGlkYXRlZCIsInRyaXBQbGFubmVyRXJyb3JNZXNzYWdlIiwiZGlmZmVyZW50Um91dGUiLCJlbiIsInRjIiwic2MiLCJtdXN0YmVXRUsiLCJub1JvdXRlRm91bmQiLCJhbGVydCIsInVuZGVmaW5lZCIsIm9wdGlvbkh0bWwiLCJwYXJhbUlkIiwic2VhcmNoU3BlY2lmaWNVUkxQYXJhbSIsInJlc3VsdCIsInNvcnRlZCIsInN0YXRpb24iLCJzb3J0IiwiYSIsImIiLCJhbHRlcmVkIiwid2VrU3RhdGlvbiIsImZpbHRlciIsIml0ZW0iLCJpZCIsInN0YXRpb25faWQiLCJyZXBsYWNlIiwic2VhcmNoV2l0aFJvdXRlIiwic3RhdGlvbl90eXBlIiwibWFwIiwidHlwZV9pZCIsInB1c2giLCJrZXkiLCJjYXRlZ29yeUhUTUwiLCJnZXRDYXRlZ29yeVRleHQiLCJodG1sIiwiYXBwZW5kIiwiZGVzdGluYXRpb24iLCJyb3V0ZV9yZXN1bHQiLCJzdGFydF9pZCIsImRlc3RfaWQiLCJ0bnhfY29ubmVjdCIsImJsb2NrSXRlbSIsInNldFRpbWVvdXQiLCJjaGFuZ2VGb250U2l6ZSIsInRueF9hcGkiLCJjcm9zc0RvbWFpbiIsIm1lc3NhZ2VzIiwiZGlzcGxheU1lc3NhZ2UiLCJzaG93TWVzc2FnZSIsInR5cGUiLCJ0ZXh0IiwiZmlsdGVyZWRNZXNzYWdlIiwiY2F0ZWdvcnkiLCJjYXRlZ29yeUtleSIsImxhbmd1YWdlUHJlZmVyZW5jZSIsInJvdXRlSWQiLCJyb3V0ZV9pZCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBQSxFQUFFQyxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVTtBQUN4QjtBQUNBO0FBQ0FGLE1BQUUsa0JBQUYsRUFBc0JHLEVBQXRCLENBQXlCLGtCQUF6QixFQUE2QyxZQUFVO0FBQy9DSCxVQUFFLG1CQUFGLEVBQXVCSSxXQUF2QixDQUFtQyxrQkFBbkM7QUFDQUosVUFBRSxJQUFGLEVBQVFLLE9BQVIsQ0FBZ0IsWUFBaEIsRUFBOEJDLFFBQTlCLENBQXVDLGtCQUF2QztBQUNBTixVQUFFLG1CQUFGLEVBQXVCTyxJQUF2QixDQUE0QixvQkFBNUIsRUFBa0RDLE9BQWxELENBQTBELENBQTFELEVBQTZEQyxTQUE3RCxDQUF1RSxHQUF2RTtBQUNILEtBSkwsRUFJT04sRUFKUCxDQUlVLFlBSlYsRUFJd0IsWUFBVTtBQUMxQkgsVUFBRSxtQkFBRixFQUF1QkksV0FBdkIsQ0FBbUMsa0JBQW5DO0FBQ1AsS0FORDtBQU9BSixNQUFFQyxRQUFGLEVBQVlFLEVBQVosQ0FBZSxZQUFmLEVBQTZCLFVBQVNPLENBQVQsRUFBVztBQUNwQyxZQUFHVCxTQUFTVSxzQkFBVCxDQUFnQyxrQkFBaEMsRUFBb0RDLE1BQXBELEdB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OUJEO0FBK0JIOztBQUVELGFBQVNmLGVBQVQsQ0FBeUJvQixXQUF6QixFQUFxQztBQUNqQyxlQUFPaEYsZ0JBQWdCc0QsWUFBaEIsQ0FBNkJOLE1BQTdCLENBQW9DLFVBQVNDLElBQVQsRUFBZUMsRUFBZixFQUFrQjtBQUN6RCxtQkFBT0QsS0FBS08sT0FBTCxLQUFpQndCLFdBQXhCO0FBQ0gsU0FGTSxFQUVKLENBRkksQ0FBUDtBQUdIO0FBQ0osQ0FoT0Q7O0FBa09BLElBQUcsQ0FBQ2hGLGVBQUosRUFBcUI7QUFDakIsUUFBSUEsZUFBSjtBQUNIOztBQUVELElBQUl5QixPQUFPd0Qsb0JBQVg7QUFDQTtBQUNBLFNBQVM1QixlQUFULENBQXlCNkIsT0FBekIsRUFBa0N4QixHQUFsQyxFQUFzQztBQUNsQyxXQUFPMUQsZ0JBQWdCMEQsR0FBaEIsRUFBcUJWLE1BQXJCLENBQTRCLFVBQVNDLElBQVQsRUFBZUMsRUFBZixFQUFrQjtBQUNqRCxlQUFPRCxLQUFLa0MsUUFBTCxLQUFrQkQsT0FBekI7QUFDSCxLQUZNLEVBRUosQ0FGSSxDQUFQO0FBR0giLCJmaWxlIjoibmF2aWdhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgICAvL25hdmlnYXRpb25cclxuICAgIC8vZGVza3RvcCBzdWJtZW51XHJcbiAgICAkKCcubWFpbi1sZXZlbC1pdGVtJykub24oJ2ZvY3VzIG1vdXNlZW50ZXInLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkKCcuYWN0aXZlLXN1Yi1sZXZlbCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUtc3ViLWxldmVsJylcclxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcubWVudS1pdGVtJykuYWRkQ2xhc3MoJ2FjdGl2ZS1zdWItbGV2ZWwnKVxyXG4gICAgICAgICAgICAkKCcuYWN0aXZlLXN1Yi1sZXZlbCcpLmZpbmQoJy5sZXZlbC0yLW1lbnUtaXRlbScpLnNsaWRlVXAoMSkuc2xpZGVEb3duKDIwMClcclxuICAgICAgICB9KS5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICQoJy5hY3RpdmUtc3ViLWxldmVsJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1zdWItbGV2ZWwnKVxyXG4gICAgfSlcclxuICAgICQoZG9jdW1lbnQpLm9uKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgaWYoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYWN0aXZlLXN1Yi1sZXZlbCcpLmxlbmd0aCA+IDAgJiYgZS50YXJnZXRUb3VjaGVzWzBdLnBhZ2VZID4gKCQoJy5hY3RpdmUtc3ViLWxldmVsIC5sZXZlbC0yLW1lbnUtaXRlbScpLm9mZnNldCgpLnRvcCArICQoJy5hY3RpdmUtc3ViLWxldmVsIC5sZXZlbC0yLW1lbnUtaXRlbScpLmhlaWdodCgpKSl7XHJcbiAgICAgICAgICAgICQoJy5hY3RpdmUtc3ViLWxldmVsJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1zdWItbGV2ZWwnKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICBtYW5pcHVsYXRlTGV2ZWwySXRlbSgpXHJcbiAgICBpbml0Rm9udFNpemVCdXR0b24oKVxyXG4gICAgXHJcbiAgICAvL21vYmlsZSBtZW51XHJcbiAgICAkKCcubWVudS1sYXllcicpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcclxuICAgICAgICAkKCcubW9iaWxlLW1lbnUtY29udGFpbmVyJykuaGFzQ2xhc3MoJ2FjdGl2ZScpICYmICQoJy5tb2JpbGUtbWVudS1jb250YWluZXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgJCgnYm9keScpLmhhc0NsYXNzKCdtb2JpbGUtbWVudS1hY3RpdmUnKSAmJiAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ21vYmlsZS1tZW51LWFjdGl2ZScpXHJcbiAgICAgICAgY29sbGFwc2VNZW51SXRlbSgpXHJcbiAgICB9KVxyXG4gICAgJCgnLm1lbnUtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAkKCcubW9iaWxlLW1lbnUtY29udGFpbmVyJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnbW9iaWxlLW1lbnUtYWN0aXZlJylcclxuICAgIH0pXHJcbiAgICAkKCcubW9iaWxlLW1lbnUtY29udGFpbmVyIC5zdWItbWVudSAubWVudS1pdGVtLXRpdGxlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmhhc0NsYXNzKCdhY3RpdmUnKSA/ICQodGhpcykucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpOiAkKHRoaXMpLnBhcmVudCgpLmFkZENsYXNzKCdhY3RpdmUnKVxyXG4gICAgfSlcclxuICAgIC8vbW9iaWxlIHRyaXAgcGxhbm5lclxyXG4gICAgJCgnLnRyaXAtcGxhbm5lci1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciB0cmlwUGxhbm5lciA9ICQoJy5tb2JpbGUtcmVzcG9uc2l2ZSAudHJpcC1wbGFubmVyLXNlYXJjaC1iYXInKVxyXG4gICAgICAgIGlmKHRyaXBQbGFubmVyLmhhc0NsYXNzKCdhY3RpdmUnKSl7XHJcbiAgICAgICAgICAgIHRyaXBQbGFubmVyLnNsaWRlVXAoKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0cmlwUGxhbm5lci5zbGlkZURvd24oKS5hZGRDbGFzcygnYWN0aXZlJylcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIHRyaXAgcGxhbm5lciBzZWFyY2ggYmFyIGluaXRcclxuICAgIGlmKHR5cGVvZiB0cmlwUGxhbm5lckRhdGEgIT0gJ29iamVjdCcgfHwgT2JqZWN0LmtleXModHJpcFBsYW5uZXJEYXRhKSA9PT0gMCl7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgdXJsOiB0cmlwX3BsYW5uZXJfYXBpXHJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgdHJpcFBsYW5uZXJEYXRhID0gZGF0YVxyXG4gICAgICAgICAgICBpbml0RHJvcGRvd24oKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICAvL3NlbGVjdCBvbmNoYW5nZVxyXG4gICAgJCgnLnRyaXAtcGxhbm5lci1zZWxlY3QtY29udGFpbmVyIC5kZXN0aW5hdGlvbiAuZHJvcGRvd24nKS5vbignY2hhbmdlJywgZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgc3RhcnQgPSAkKHRoaXMpLnBhcmVudHMoJy50cmlwLXBsYW5uZXItc2VsZWN0LWNvbnRhaW5lcicpLmZpbmQoJy5kZXN0aW5hdGlvbiAuZHJvcGRvd24nKS5maXJzdCgpLnZhbCgpLFxyXG4gICAgICAgICAgICBlbmQgPSAkKHRoaXMpLnBhcmVudHMoJy50cmlwLXBsYW5uZXItc2VsZWN0LWNvbnRhaW5lcicpLmZpbmQoJy5kZXN0aW5hdGlvbiAuZHJvcGRvd24nKS5sYXN0KCkudmFsKClcclxuICAgICAgICAvL2NoYW5nZSB0aGUgb3RoZXIgZHJvcGRvd24gdmFsdWUgdG8gV0VLXHJcbiAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcuZGVzdGluYXRpb24nKS5pcygnOmZpcnN0LWNoaWxkJykgJiYgJCgnLnRyaXAtcGxhbm5lci1zZWxlY3QtY29udGFpbmVyIC5kcm9wZG93bicpLmxhc3QoKS52YWwoXCJXRUtcIilcclxuICAgICAgICAvLyBlbmFibGUgc2VhcmNoIGJ1dHRvblxyXG4gICAgICAgIHN0YXJ0ICYmIGVuZCA/ICQodGhpcykucGFyZW50cygnLnNlYXJjaC1iYXItY29udGFpbmVyJykuZmluZCgnLnNlYXJjaC1idXR0b24nKS5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKSA6ICQodGhpcykucGFyZW50cygnLnNlYXJjaC1iYXItY29udGFpbmVyJykuZmluZCgnLnNlYXJjaC1idXR0b24nKS5hdHRyKCdkaXNhYmxlZCcsIHRydWUpXHJcbiAgICB9KVxyXG4gICAgLy9zd2l0Y2ggc2VsZWN0IHZhbHVlXHJcbiAgICAkKCcudHJpcC1wbGFubmVyLXNlbGVjdC1jb250YWluZXIgLnRyaXAtcGxhbm5lci1zd2l0Y2gnKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBkZXN0aW9uYXRpb24xID0gJCgkKHRoaXMpLnBhcmVudCgpLnNpYmxpbmdzKCcuZGVzdGluYXRpb24nKVswXSkuZmluZCgnLmRyb3Bkb3duJykudmFsKCksXHJcbiAgICAgICAgICAgIGRlc3Rpb25hdGlvbjIgPSAkKCQodGhpcykucGFyZW50KCkuc2libGluZ3MoJy5kZXN0aW5hdGlvbicpWzFdKS5maW5kKCcuZHJvcGRvd24nKS52YWwoKVxyXG4gICAgICAgICQoJCh0aGlzKS5wYXJlbnQoKS5zaWJsaW5ncygnLmRlc3RpbmF0aW9uJylbMF0pLmZpbmQoJy5kcm9wZG93bicpLnZhbChkZXN0aW9uYXRpb24yKVxyXG4gICAgICAgICQoJCh0aGlzKS5wYXJlbnQoKS5zaWJsaW5ncygnLmRlc3RpbmF0aW9uJylbMV0pLmZpbmQoJy5kcm9wZG93bicpLnZhbChkZXN0aW9uYXRpb24xKVxyXG4gICAgfSlcclxuICAgIC8vc2VhcmNoIHJlc3VsdCBidXR0b25cclxuICAgICQoJy5zZWFyY2gtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgc3RhcnQgPSAkKHRoaXMpLnNpYmxpbmdzKCcudHJpcC1wbGFubmVyLXNlbGVjdC1jb250YWluZXInKS5maW5kKCcuZGVzdGluYXRpb24gLmRyb3Bkb3duJykuZmlyc3QoKS52YWwoKSxcclxuICAgICAgICAgICAgZW5kID0gJCh0aGlzKS5zaWJsaW5ncygnLnRyaXAtcGxhbm5lci1zZWxlY3QtY29udGFpbmVyJykuZmluZCgnLmRlc3RpbmF0aW9uIC5kcm9wZG93bicpLmxhc3QoKS52YWwoKSxcclxuICAgICAgICAgICAgcm91dGVSZXN1bHQgPSBmaW5kUm91dGVSZXN1bHQoc3RhcnQsIGVuZClcclxuICAgICAgICB0cmlwU2VhcmNoVmFsaWRhdGlvbihzdGFydCwgZW5kLCByb3V0ZVJlc3VsdCwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gXCIvXCIgKyBsYW5nICsgJy90cmlwLXBsYW5uZXIvaW5kZXguaHRtbD9pZD0nICsgcm91dGVSZXN1bHRcclxuICAgICAgICB9KVxyXG4gICAgICAgIFxyXG4gICAgfSlcclxuICAgIC8vc2VhcmNoIGJhciB2YWxpZGF0aW9uXHJcbiAgICBmdW5jdGlvbiB0cmlwU2VhcmNoVmFsaWRhdGlvbihzdGFydCwgZW5kLCByb3V0ZVJlc3VsdCwgY2FsbGJhY2spe1xyXG4gICAgICAgIHZhciB2YWxpZGF0ZWQgPSB0cnVlLFxyXG4gICAgICAgICAgICB0cmlwUGxhbm5lckVycm9yTWVzc2FnZSA9IHtcclxuICAgICAgICAgICAgZGlmZmVyZW50Um91dGU6IHtcclxuICAgICAgICAgICAgICAgIGVuOiAnUGxlYXNlIHNlbGVjdCBhIGRpZmZlcmVudCBzdGF0aW9uLicsXHJcbiAgICAgICAgICAgICAgICB0YzogJ+iri+mBuOaTh+S4jeWQjOi7iuermeOAgicsXHJcbiAgICAgICAgICAgICAgICBzYzogJ+ivt+mAieaLqeS4jeWQjOi9puermeOAgidcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbXVzdGJlV0VLOiB7XHJcbiAgICAgICAgICAgICAgICBlbjogJ1BsZWFzZSBzZWxlY3QgV2VzdCBLb3dsb29uIFN0YXRpb24gYXMgdGhlIGRlcGFydHVyZS9hcnJpdmFsIHN0YXRpb24uJyxcclxuICAgICAgICAgICAgICAgIHRjOiAn6KuL6YG45pOH6aaZ5riv6KW/5Lmd6b6N54K66LW36bueL+e1gum7nuOAgicsXHJcbiAgICAgICAgICAgICAgICBzYzogJ+ivt+mAieaLqemmmea4r+ilv+S5nem+meS4uui1t+eCuS/nu4jngrnjgIInXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG5vUm91dGVGb3VuZDoge1xyXG4gICAgICAgICAgICAgICAgZW46ICdUaGUgdHJhaW4gbnVtYmVyIGRvZXMgbm90IGV4aXN0LiBQbGVhc2Ugc2VsZWN0IGFub3RoZXIgb25lLicsXHJcbiAgICAgICAgICAgICAgICB0YzogJ+aJgOmBuOWIl+i7iuS4puS4jeWtmOWcqO+8jOiri+mHjeaWsOmBuOaTh+OAgicsXHJcbiAgICAgICAgICAgICAgICBzYzogJ+aJgOmAieWIl+i9puW5tuS4jeWtmOWcqO+8jOivt+mHjeaWsOmAieaLqeOAgidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih2YWxpZGF0ZWQgJiYgc3RhcnQgPT09IGVuZCl7XHJcbiAgICAgICAgICAgIHZhbGlkYXRlZCA9IGZhbHNlXHJcbiAgICAgICAgICAgIHdpbmRvdy5hbGVydCh0cmlwUGxhbm5lckVycm9yTWVzc2FnZS5kaWZmZXJlbnRSb3V0ZVtsYW5nXSlcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodmFsaWRhdGVkICYmICEoc3RhcnQgPT09IFwiV0VLXCIgfHwgZW5kID09PSBcIldFS1wiKSl7XHJcbiAgICAgICAgICAgIHZhbGlkYXRlZCA9IGZhbHNlXHJcbiAgICAgICAgICAgIHdpbmRvdy5hbGVydCh0cmlwUGxhbm5lckVycm9yTWVzc2FnZS5tdXN0YmVXRUtbbGFuZ10pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHZhbGlkYXRlZCAmJiBmaW5kUm91dGVSZXN1bHQoc3RhcnQsZW5kKSA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdmFsaWRhdGVkID0gZmFsc2VcclxuICAgICAgICAgICAgd2luZG93LmFsZXJ0KHRyaXBQbGFubmVyRXJyb3JNZXNzYWdlLm5vUm91dGVGb3VuZFtsYW5nXSlcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodmFsaWRhdGVkKXtcclxuICAgICAgICAgICAgY2FsbGJhY2socm91dGVSZXN1bHQpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy9pbml0IHNlYXJjaCBiYXIgZHJvcGRvd25cclxuICAgIGZ1bmN0aW9uIGluaXREcm9wZG93bigpe1xyXG4gICAgICAgIHZhciBvcHRpb25IdG1sID0gJycsXHJcbiAgICAgICAgICAgIHBhcmFtSWQgPSBzZWFyY2hTcGVjaWZpY1VSTFBhcmFtKCdpZCcpLFxyXG4gICAgICAgICAgICByZXN1bHQsXHJcbiAgICAgICAgICAgIHNvcnRlZCA9IHRyaXBQbGFubmVyRGF0YS5zdGF0aW9uLnNvcnQoZnVuY3Rpb24oYSwgYil7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYVsnb3JkZXJfJyArIGxhbmddIC0gYlsnb3JkZXJfJyArIGxhbmddXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBhbHRlcmVkID0ge30sXHJcbiAgICAgICAgICAgIHdla1N0YXRpb24gPSB0cmlwUGxhbm5lckRhdGEuc3RhdGlvbi5maWx0ZXIoZnVuY3Rpb24oaXRlbSwgaWQpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uc3RhdGlvbl9pZCA9PSBcIldFS1wiICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KVswXVxyXG4gICAgICAgIHBhcmFtSWQgPSBwYXJhbUlkID8gcGFyYW1JZC5yZXBsYWNlKC8oW15hLXpBLVoxLTldKS9nLCAnJykgOiBwYXJhbUlkXHJcbiAgICAgICAgcmVzdWx0ID0gc2VhcmNoV2l0aFJvdXRlKHBhcmFtSWQsICdyb3V0ZV9yZXN1bHQnKVxyXG4gICAgICAgIHRyaXBQbGFubmVyRGF0YS5zdGF0aW9uX3R5cGUubWFwKGZ1bmN0aW9uKGl0ZW0sIGlkKXtcclxuICAgICAgICAgICAgYWx0ZXJlZFtpdGVtLnR5cGVfaWRdID0gW11cclxuICAgICAgICB9KVxyXG4gICAgICAgIHRyaXBQbGFubmVyRGF0YS5zdGF0aW9uLm1hcChmdW5jdGlvbihpdGVtLCBpZCl7XHJcbiAgICAgICAgICAgIGFsdGVyZWRbaXRlbS50eXBlX2lkXS5wdXNoKGl0ZW0pXHJcbiAgICAgICAgfSlcclxuICAgICAgICBmb3IodmFyIGtleSBpbiBhbHRlcmVkKXtcclxuICAgICAgICAgICAgdmFyIGNhdGVnb3J5SFRNTCA9ICc8b3B0aW9uIGRpc2FibGVkPuS4gOS4gCAnICsgZ2V0Q2F0ZWdvcnlUZXh0KGtleSlbJ3R5cGVfJyArIGxhbmddICsgJyDkuIDkuIA8L29wdGlvbj4nXHJcbiAgICAgICAgICAgIG9wdGlvbkh0bWwgPSBvcHRpb25IdG1sICsgY2F0ZWdvcnlIVE1MXHJcbiAgICAgICAgICAgIGFsdGVyZWRba2V5XS5tYXAoZnVuY3Rpb24oaXRlbSAsaWQpe1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSAnPG9wdGlvbiB2YWx1ZT1cIicgKyBpdGVtLnN0YXRpb25faWQgKyAnXCI+JyArIGl0ZW1bJ3N0YXRpb25fdGl0bGVfJyArIGxhbmddICsgJzwvb3B0aW9uPidcclxuICAgICAgICAgICAgICAgIG9wdGlvbkh0bWwgPSBvcHRpb25IdG1sICsgaHRtbFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICAkKCcudHJpcC1wbGFubmVyLXNlbGVjdC1jb250YWluZXIgLmRlc3RpbmF0aW9uIC5kcm9wZG93bicpLmFwcGVuZChvcHRpb25IdG1sKVxyXG4gICAgICAgIC8vIGRlYnVnZ2VyXHJcbiAgICAgICAgcmVzdWx0ID8gKFxyXG4gICAgICAgICAgICAkKCcudHJpcC1wbGFubmVyLXNlbGVjdC1jb250YWluZXIgLmRlc3RpbmF0aW9uOmZpcnN0LWNoaWxkIC5kcm9wZG93bicpLnZhbChyZXN1bHRbJ3N0YXJ0X2lkJ10pLFxyXG4gICAgICAgICAgICAkKCcudHJpcC1wbGFubmVyLXNlbGVjdC1jb250YWluZXIgLmRlc3RpbmF0aW9uOmxhc3QtY2hpbGQgLmRyb3Bkb3duJykudmFsKHJlc3VsdFsnZGVzdF9pZCddKSxcclxuICAgICAgICAgICAgJCgnLnNlYXJjaC1idXR0b24nKS5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKVxyXG4gICAgICAgICkgOiAkKCcudHJpcC1wbGFubmVyLXNlbGVjdC1jb250YWluZXIgLmRlc3RpbmF0aW9uOmZpcnN0LWNoaWxkIC5kcm9wZG93bicpLnZhbCh3ZWtTdGF0aW9uLnN0YXRpb25faWQpXHJcbiAgICB9XHJcbiAgICAvL2ZpbmQgcm91dGUgcmVzdWx0XHJcbiAgICBmdW5jdGlvbiBmaW5kUm91dGVSZXN1bHQoc3RhcnQsIGRlc3RpbmF0aW9uKXtcclxuICAgICAgICB2YXIgcm91dGVSZXN1bHQgPSB0cmlwUGxhbm5lckRhdGEucm91dGVfcmVzdWx0LmZpbHRlcihmdW5jdGlvbihpdGVtLCBpZCl7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtLnN0YXJ0X2lkID09PSBzdGFydCAmJiBpdGVtLmRlc3RfaWQgPT09IGRlc3RpbmF0aW9uXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gcm91dGVSZXN1bHQubGVuZ3RoID4gMCA/IHJvdXRlUmVzdWx0WzBdWydyb3V0ZV9pZCddIDogdW5kZWZpbmVkXHJcbiAgICB9XHJcbiAgICAvL3RueFxyXG4gICAgdG54X2Nvbm5lY3QoKVxyXG5cclxuICAgIGZ1bmN0aW9uIG1hbmlwdWxhdGVMZXZlbDJJdGVtKCl7XHJcbiAgICAgICAgdmFyIGJsb2NrSXRlbVxyXG4gICAgICAgICQubWFwKCQoJy5sZXZlbC0yLWl0ZW0tYmxvY2snKSwgZnVuY3Rpb24oaXRlbSwgaWQpe1xyXG4gICAgICAgICAgICBibG9ja0l0ZW0gPSBpdGVtXHJcbiAgICAgICAgICAgICQubWFwKCQoYmxvY2tJdGVtKS5maW5kKCcubGV2ZWwtMi1zdWItbWVudScpLCBmdW5jdGlvbihpdGVtLCBpZCl7XHJcbiAgICAgICAgICAgICAgICBpZiggaWQgJSAzID09PSAwICl7XHJcbiAgICAgICAgICAgICAgICAgICAgJChibG9ja0l0ZW0pLmFwcGVuZCgnPHNwYW4gY2xhc3M9XCJsZXZlbC0yLWl0ZW0tcm93XCI+PC9zcGFuPicpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkKGJsb2NrSXRlbSkuZmluZCgnLmxldmVsLTItaXRlbS1yb3c6bGFzdC1jaGlsZCcpLmFwcGVuZChpdGVtKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIGNvbGxhcHNlTWVudUl0ZW0gKCl7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkKCcubW9iaWxlLW1lbnUtY29udGFpbmVyLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICB9LCA1MDApXHJcbiAgICB9XHJcbiAgICBcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0Rm9udFNpemVCdXR0b24oKXtcclxuICAgICAgICAkKCQoJy5zaXplLXN3aXRjaCBbZm9udC1zaXplXScpKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBjaGFuZ2VGb250U2l6ZSgkKHRoaXMpLmF0dHIoJ2ZvbnQtc2l6ZScpKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG54X2Nvbm5lY3QoKXtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IHRueF9hcGksXHJcbiAgICAgICAgICAgIGNyb3NzRG9tYWluOiB0cnVlLFxyXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgIHZhciBtZXNzYWdlcyA9IGRhdGEubWVzc2FnZXMsXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5TWVzc2FnZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICB0YzogJ+acgOaWsOi7iuWLmeizh+ioiicsXHJcbiAgICAgICAgICAgICAgICAgICAgc2M6ICfmnIDmlrDovabliqHotYTorq8nLFxyXG4gICAgICAgICAgICAgICAgICAgIGVuOiAnTGF0ZXN0IFNlcnZpY2UgSW5mb3JtYXRpb24nXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2hvd01lc3NhZ2UgPSBmdW5jdGlvbih0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnRyYWZmaWMtbmV3cycpLmFkZENsYXNzKHR5cGUpLmZpbmQoJy5tZXNzYWdlJykuYXR0cignaHJlZicsIG1lc3NhZ2VzWzBdWyd1cmxfJyArIGxhbmddKS5maW5kKCcuY29udGVudC13cmFwcGVyJykudGV4dChkaXNwbGF5TWVzc2FnZVtsYW5nXSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYobWVzc2FnZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgLy8gbWVzc2FnZXMuc29ydChmdW5jdGlvbihhLCBiKXtcclxuICAgICAgICAgICAgICAgIC8vICAgICBpZihhLmNhdGVnb3J5ID09IDEgfHwgYS5jYXRlZ29yeSA9PSAzKXtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgcmV0dXJuIDFcclxuICAgICAgICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgcmV0dXJuIHBhcnNlSW50KGEuY2F0ZWdvcnkpID4gcGFyc2VJbnQoYi5jYXRlZ29yeSlcclxuICAgICAgICAgICAgICAgIC8vIH0pXHJcbiAgICAgICAgICAgICAgICB2YXIgZmlsdGVyZWRNZXNzYWdlID0gbWVzc2FnZXMuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0saWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmNhdGVnb3J5ID09IDEgfHwgaXRlbS5jYXRlZ29yeSA9PSAzXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgaWYoZmlsdGVyZWRNZXNzYWdlLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3dNZXNzYWdlKCdhbGVydCcpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3dNZXNzYWdlKCdpbmZvcm1hdGlvbicpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldENhdGVnb3J5VGV4dChjYXRlZ29yeUtleSl7XHJcbiAgICAgICAgcmV0dXJuIHRyaXBQbGFubmVyRGF0YS5zdGF0aW9uX3R5cGUuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0sIGlkKXtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0udHlwZV9pZCA9PT0gY2F0ZWdvcnlLZXlcclxuICAgICAgICB9KVswXVxyXG4gICAgfVxyXG59KVxyXG5cclxuaWYoIXRyaXBQbGFubmVyRGF0YSkge1xyXG4gICAgdmFyIHRyaXBQbGFubmVyRGF0YVxyXG59XHJcblxyXG52YXIgbGFuZyA9IGxhbmd1YWdlUHJlZmVyZW5jZSgpXHJcbi8vc2VhcmNoIHJvdXRlXHJcbmZ1bmN0aW9uIHNlYXJjaFdpdGhSb3V0ZShyb3V0ZUlkLCBrZXkpe1xyXG4gICAgcmV0dXJuIHRyaXBQbGFubmVyRGF0YVtrZXldLmZpbHRlcihmdW5jdGlvbihpdGVtLCBpZCl7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW0ucm91dGVfaWQgPT09IHJvdXRlSWRcclxuICAgIH0pWzBdXHJcbn0iXX0=
