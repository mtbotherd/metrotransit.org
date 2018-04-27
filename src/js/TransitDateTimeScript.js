$(function () {
    $.fn.exists = function (callback) {
        var args = [].slice.call(arguments, 1);
        if (this.length) { callback.call(this, args); }
        return this;
    };
    $('.date-picker-all').each(function (i) {
        $(this).datetimepicker({ pickTime: false });
    });
    $('.date-picker-last-ten').each(function (i) {
        var d = new Date();
        d.setDate(d.getDate() - 10);
        $(this).datetimepicker({
            pickTime: false,
            startDate: d,
            endDate: new Date()
        });
        $(this).on('keypress paste', function (e) {
            e.preventDefault();
            return false;
        });
    });
    $('.date-picker').each(function (i) {
        $(this).datetimepicker({ pickTime: false, startDate: new Date() });
    });
    $('.time-picker').each(function (i) {
        $(this).datetimepicker({ language: 'en', pickDate: false, pick12HourFormat: true, pickSeconds: false });
    });

    $('html').click(function () { $('.bootstrap-datetimepicker-widget').hide(); });
    $('.close-time').click(function () { $(this).closest('.bootstrap-datetimepicker-widget').hide(); });
    $('.bootstrap-datetimepicker-widget').click(function (e) { e.stopPropagation(); });

    $('.add-on').on('click', function (e) {
        $('.datepicker').parent().hide();
        $('.timepicker').parent().hide();

        var picker = $(this).parent().data('datetimepicker');

        if ($(this).attr("class").indexOf("date") >= 0) {
            picker.height = picker.component ? picker.component.outerHeight() : picker.$element.outerHeight();
            picker.place();
            picker.set();
            $('.datepicker-days').show();
            picker.widget.show();
        }
        else if ($(this).attr("class").indexOf("time") >= 0) {
            picker.height = picker.component ? picker.component.outerHeight() : picker.$element.outerHeight();
            picker.place();
            picker.set();
            picker.widget.show();
        }
        e.stopPropagation();
    });
});

/**
* @license
* =========================================================
* bootstrap-datetimepicker.js
* http://www.eyecon.ro/bootstrap-datepicker
* =========================================================
* Copyright 2012 Stefan Petre
*
* Contributions:
*  - Andrew Rowls
*  - Thiago de Arruda
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =========================================================
*/
(function ($) {
    var smartPhone = window.orientation != undefined;
    var DateTimePicker = function (element, options) { this.id = dpgId++; this.init(element, options) };
    var dateToDate = function (dt) { if (typeof dt === "string") { return new Date(dt) } return dt };
    DateTimePicker.prototype = {
        constructor: DateTimePicker, init: function (element, options) {
            var icon;
            if (!(options.pickTime || options.pickDate))
                throw new Error("Must choose at least one picker");
            this.options = options;
            this.$element = $(element);
            this.language = options.language in dates ? options.language : "en";
            this.pickDate = options.pickDate;
            this.pickTime = options.pickTime;
            this.isInput = this.$element.is("input");
            this.component = false;
            if (this.$element.find(".input-append") || this.$element.find(".input-prepend"))
                this.component = this.$element.find(".add-on");
            this.format = options.format;
            if (!this.format) {
                if (this.isInput) this.format = this.$element.data("format");
                else this.format = this.$element.find("input").data("format");
                if (!this.format) this.format = "MM/dd/yyyy"
            }
            this._compileFormat();
            if (this.component) {
                icon = this.component.find("i")
            }
            if (this.pickTime) {
                if (icon && icon.length) this.timeIcon = icon.data("time-icon");
                if (!this.timeIcon) this.timeIcon = "icon-time";
                icon.addClass(this.timeIcon)
            }
            if (this.pickDate) {
                if (icon && icon.length) this.dateIcon = icon.data("date-icon");
                if (!this.dateIcon) this.dateIcon = "icon-calendar";
                icon.removeClass(this.timeIcon);
                icon.addClass(this.dateIcon)
            }
            this.widget = $(getTemplate(this.timeIcon, options.pickDate, options.pickTime, options.pick12HourFormat, options.pickSeconds, options.collapse)).appendTo("body");
            this.minViewMode = options.minViewMode || this.$element.data("date-minviewmode") || 0;
            if (typeof this.minViewMode === "string") {
                switch (this.minViewMode) {
                    case "months": this.minViewMode = 1; break;
                    case "years": this.minViewMode = 2; break;
                    default: this.minViewMode = 0; break
                }
            }
            this.viewMode = options.viewMode || this.$element.data("date-viewmode") || 0;
            if (typeof this.viewMode === "string") {
                switch (this.viewMode) {
                    case "months": this.viewMode = 1;
                        break;
                    case "years": this.viewMode = 2;
                        break;
                    default: this.viewMode = 0;
                        break
                }
            }
            this.startViewMode = this.viewMode;
            this.weekStart = options.weekStart || this.$element.data("date-weekstart") || 0;
            this.weekEnd = this.weekStart === 0 ? 6 : this.weekStart - 1;
            this.setStartDate(options.startDate || this.$element.data("date-startdate"));
            this.setEndDate(options.endDate || this.$element.data("date-enddate"));
            this.fillDow();
            this.fillMonths();
            this.fillHours();
            this.fillMinutes();
            this.fillSeconds();
            this.update();
            this.showMode();
            this._attachDatePickerEvents()
        },
        show: function (e) {

            //this.widget.show();
            //this.height = this.component ? this.component.outerHeight() : this.$element.outerHeight();
            //this.place();
            //this.$element.trigger({ type: "show", date: this._date });
            //this._attachDatePickerGlobalEvents();
            //if (e) { e.stopPropagation(); e.preventDefault() }
        },
        disable: function () {
            this.$element.find("input").prop("disabled", true);
            this._detachDatePickerEvents()
        },
        enable: function () {
            this.$element.find("input").prop("disabled", false);
            this._attachDatePickerEvents()
        },
        hide: function () {
            //var collapse = this.widget.find(".collapse");
            //for (var i = 0; i < collapse.length; i++) {
            //    var collapseData = collapse.eq(i).data("collapse");
            //    if (collapseData && collapseData.transitioning) return
            //}
            //this.widget.hide();
            //this.viewMode = this.startViewMode;
            //this.showMode();
            //this.set();
            //this.$element.trigger({ type: "hide", date: this._date });
            //this._detachDatePickerGlobalEvents()
        },
        set: function () {
            var formatted = "";
            if (!this._unset) formatted = this.formatDate(this._date);
            if (!this.isInput) {
                if (this.component) {
                    var input = this.$element.find("input");
                    input.val(formatted);
                    this._resetMaskPos(input)
                }
                this.$element.data("date", formatted)
            }
            else {
                this.$element.val(formatted);
                this._resetMaskPos(this.$element)
            }
        },
        setValue: function (newDate) {
            if (!newDate) { this._unset = true }
            else { this._unset = false }
            if (typeof newDate === "string") { this._date = this.parseDate(newDate) }
            else if (newDate) { this._date = new Date(newDate) }
            this.set();
            this.viewDate = UTCDate(this._date.getUTCFullYear(), this._date.getUTCMonth(), 1, 0, 0, 0, 0);
            this.fillDate();
            this.fillTime()
        },
        getDate: function () {
            if (this._unset) return null;
            return new Date(this._date.valueOf())
        },
        setDate: function (date) {
            if (!date) this.setValue(null);
            else this.setValue(date.valueOf())
        },
        setStartDate: function (date) {
            if (date instanceof Date) {
                this.startDate = date
            }
            else if (typeof date === "string") {
                this.startDate = new UTCDate(date);
                if (!this.startDate.getUTCFullYear()) { this.startDate = -Infinity }
            }
            else { this.startDate = -Infinity }
            if (this.viewDate) { this.update() }
        },
        setEndDate: function (date) {
            if (date instanceof Date) { this.endDate = date }
            else if (typeof date === "string") {
                this.endDate = new UTCDate(date);
                if (!this.endDate.getUTCFullYear()) { this.endDate = Infinity }
            }
            else { this.endDate = Infinity }
            if (this.viewDate) { this.update() }
        },
        getLocalDate: function () {
            if (this._unset) return null;
            var d = this._date;
            return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds())
        },
        setLocalDate: function (localDate) {
            if (!localDate) this.setValue(null);
            else this.setValue(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), localDate.getHours(), localDate.getMinutes(), localDate.getSeconds(), localDate.getMilliseconds()))
        },
        place: function () {
            var position = "absolute";
            var offset = this.component ? this.component.offset() : this.$element.offset();
            this.width = this.component ? this.component.outerWidth() : this.$element.outerWidth();
            offset.top = offset.top + this.height;
            var $window = $(window);
            if (this.options.width != undefined) {
                this.widget.width(this.options.width)
            }
            if (this.options.orientation == "left") {
                this.widget.addClass("left-oriented");
                offset.left = offset.left - this.widget.width() + 20
            }
            if (this._isInFixed()) {
                position = "fixed";
                offset.top -= $window.scrollTop();
                offset.left -= $window.scrollLeft()
            }
            if ($window.width() < offset.left + this.widget.outerWidth()) {
                offset.right = $window.width() - offset.left - this.width;
                offset.left = "auto";
                this.widget.addClass("pull-right")
            }
            else {
                offset.right = "auto";
                this.widget.removeClass("pull-right")
            }
            this.widget.css({ position: position, top: offset.top, left: offset.left, right: offset.right })
        },
        notifyChange: function () {
            this.$element.trigger({ type: "changeDate", date: this.getDate(), localDate: this.getLocalDate() })
        },
        update: function (newDate) {
            var dateStr = newDate; if (!dateStr) {
                if (this.isInput) { dateStr = this.$element.val() }
                else { dateStr = this.$element.find("input").val() }
                if (dateStr) { this._date = this.parseDate(dateStr) }
                if (!this._date) {
                    var tmp = new Date;
                    this._date = UTCDate(tmp.getFullYear(), tmp.getMonth(), tmp.getDate(), tmp.getHours(), tmp.getMinutes(), tmp.getSeconds(), tmp.getMilliseconds())
                }
            } this.viewDate = UTCDate(this._date.getUTCFullYear(), this._date.getUTCMonth(), 1, 0, 0, 0, 0); this.fillDate(); this.fillTime()
        },
        fillDow: function () {
            var dowCnt = this.weekStart;
            var html = $("<tr>");
            while (dowCnt < this.weekStart + 7) {
                html.append('<th class="dow">' + dates[this.language].daysMin[dowCnt++ % 7] + "</th>")
            } this.widget.find(".datepicker-days thead").append(html)
        },
        fillMonths: function () {
            var html = "";
            var i = 0;
            while (i < 12) {
                html += '<span class="month">' + dates[this.language].monthsShort[i++] + "</span>"
            }
            this.widget.find(".datepicker-months td").append(html)
        },
        fillDate: function () {
            var year = this.viewDate.getUTCFullYear();
            var month = this.viewDate.getUTCMonth();
            var currentDate = UTCDate(this._date.getUTCFullYear(), this._date.getUTCMonth(), this._date.getUTCDate(), 0, 0, 0, 0);
            var startYear = typeof this.startDate === "object" ? this.startDate.getUTCFullYear() : -Infinity;
            var startMonth = typeof this.startDate === "object" ? this.startDate.getUTCMonth() : -1;
            var endYear = typeof this.endDate === "object" ? this.endDate.getUTCFullYear() : Infinity;
            var endMonth = typeof this.endDate === "object" ? this.endDate.getUTCMonth() : 12;
            this.widget.find(".datepicker-days").find(".disabled").removeClass("disabled");
            this.widget.find(".datepicker-months").find(".disabled").removeClass("disabled");
            this.widget.find(".datepicker-years").find(".disabled").removeClass("disabled");
            this.widget.find(".datepicker-days th:eq(1)").text(dates[this.language].months[month] + " " + year);
            var prevMonth = UTCDate(year, month - 1, 28, 0, 0, 0, 0);
            var day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth()); prevMonth.setUTCDate(day); prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.weekStart + 7) % 7);
            if (year == startYear && month <= startMonth || year < startYear) {
                this.widget.find(".datepicker-days th:eq(0)").addClass("disabled")
            }
            if (year == endYear && month >= endMonth || year > endYear) {
                this.widget.find(".datepicker-days th:eq(2)").addClass("disabled")
            }
            var nextMonth = new Date(prevMonth.valueOf());
            nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
            nextMonth = nextMonth.valueOf();
            var html = [];
            var row;
            var clsName;
            while (prevMonth.valueOf() < nextMonth) {
                if (prevMonth.getUTCDay() === this.weekStart) {
                    row = $("<tr>"); html.push(row)
                }
                clsName = "";
                if (prevMonth.getUTCFullYear() < year || prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() < month) {
                    clsName += " old"
                } else if (prevMonth.getUTCFullYear() > year || prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() > month) {
                    clsName += " new"
                }
                if (prevMonth.valueOf() === currentDate.valueOf()) {
                    clsName += " active"
                }
                if (prevMonth.valueOf() + 864e5 <= this.startDate) { clsName += " disabled" }
                if (prevMonth.valueOf() > this.endDate) { clsName += " disabled" }
                row.append('<td class="day' + clsName + '">' + prevMonth.getUTCDate() + "</td>");
                prevMonth.setUTCDate(prevMonth.getUTCDate() + 1)
            }
            this.widget.find(".datepicker-days tbody").empty().append(html);
            var currentYear = this._date.getUTCFullYear();
            var months = this.widget.find(".datepicker-months").find("th:eq(1)").text(year).end().find("span").removeClass("active");
            if (currentYear === year) { months.eq(this._date.getUTCMonth()).addClass("active") }
            if (currentYear - 1 < startYear) {
                this.widget.find(".datepicker-months th:eq(0)").addClass("disabled")
            }
            if (currentYear + 1 > endYear) {
                this.widget.find(".datepicker-months th:eq(2)").addClass("disabled")
            }
            for (var i = 0; i < 12; i++) {
                if (year == startYear && startMonth > i || year < startYear) {
                    $(months[i]).addClass("disabled")
                } else if (year == endYear && endMonth < i || year > endYear) {
                    $(months[i]).addClass("disabled")
                }
            }
            html = "";
            year = parseInt(year / 10, 10) * 10;
            var yearCont = this.widget.find(".datepicker-years").find("th:eq(1)").text(year + "-" + (year + 9)).end().find("td");
            this.widget.find(".datepicker-years").find("th").removeClass("disabled");
            if (startYear > year) {
                this.widget.find(".datepicker-years").find("th:eq(0)").addClass("disabled")
            }
            if (endYear < year + 9) {
                this.widget.find(".datepicker-years").find("th:eq(2)").addClass("disabled")
            }
            year -= 1;
            for (var i = -1; i < 11; i++) {
                html += '<span class="year' + (i === -1 || i === 10 ? " old" : "") + (currentYear === year ? " active" : "") + (year < startYear || year > endYear ? " disabled" : "") + '">' + year + "</span>";
                year += 1
            }
            yearCont.html(html)
        },
        fillHours: function () {
            var table = this.widget.find(".timepicker .timepicker-hours table");
            table.parent().hide(); var html = ""; if (this.options.pick12HourFormat) {
                var current = 1; for (var i = 0; i < 3; i += 1) {
                    html += "<tr>"; for (var j = 0; j < 4; j += 1) {
                        var c = current.toString(); html += '<td class="hour">' + padLeft(c, 2, "0") + "</td>";
                        current++
                    } html += "</tr>"
                }
            } else {
                var current = 0; for (var i = 0; i < 6; i += 1) {
                    html += "<tr>"; for (var j = 0; j < 4; j += 1) {
                        var c = current.toString(); html += '<td class="hour">' + padLeft(c, 2, "0") + "</td>";
                        current++
                    } html += "</tr>"
                }
            } table.html(html)
        },
        fillMinutes: function () {
            var table = this.widget.find(".timepicker .timepicker-minutes table");
            table.parent().hide(); var html = ""; var current = 0; for (var i = 0; i < 5; i++) {
                html += "<tr>"; for (var j = 0; j < 4; j += 1) {
                    var c = current.toString();
                    html += '<td class="minute">' + padLeft(c, 2, "0") + "</td>";
                    current += 3
                } html += "</tr>"
            } table.html(html)
        },
        fillSeconds: function () {
            var table = this.widget.find(".timepicker .timepicker-seconds table");
            table.parent().hide(); var html = ""; var current = 0; for (var i = 0; i < 5; i++) {
                html += "<tr>"; for (var j = 0; j < 4; j += 1) {
                    var c = current.toString();
                    html += '<td class="second">' + padLeft(c, 2, "0") + "</td>";
                    current += 3
                } html += "</tr>"
            } table.html(html)
        },
        fillTime: function () {
            if (!this._date) return;
            var timeComponents = this.widget.find(".timepicker span[data-time-component]");
            var table = timeComponents.closest("table");
            var is12HourFormat = this.options.pick12HourFormat;
            var hour = this._date.getUTCHours(); var period = "AM";
            if (is12HourFormat) {
                if (hour >= 12) period = "PM";
                if (hour === 0) hour = 12; else if (hour != 12) hour = hour % 12;
                this.widget.find(".timepicker [data-action=togglePeriod]").text(period)
            } hour = padLeft(hour.toString(), 2, "0");
            var minute = padLeft(this._date.getUTCMinutes().toString(), 2, "0");
            var second = padLeft(this._date.getUTCSeconds().toString(), 2, "0");
            timeComponents.filter("[data-time-component=hours]").text(hour);
            timeComponents.filter("[data-time-component=minutes]").text(minute);
            timeComponents.filter("[data-time-component=seconds]").text(second)
        },
        click: function (e) {
            e.stopPropagation();
            e.preventDefault();
            this._unset = false;
            var target = $(e.target).closest("span, td, th");
            if (target.length === 1) {
                if (!target.is(".disabled")) {
                    switch (target[0].nodeName.toLowerCase()) {
                        case "th": switch (target[0].className) {
                            case "switch": /*this.showMode(1);*/ break;
                            case "prev":
                            case "next":
                                var vd = this.viewDate;
                                var navFnc = DPGlobal.modes[this.viewMode].navFnc;
                                var step = DPGlobal.modes[this.viewMode].navStep;
                                if (target[0].className === "prev") step = step * -1; vd["set" + navFnc](vd["get" + navFnc]() + step); this.fillDate(); this.set(); break
                        } break;
                        case "span":
                            if (target.is(".month")) {
                                var month = target.parent().find("span").index(target);
                                this.viewDate.setUTCMonth(month)
                            } else {
                                var year = parseInt(target.text(), 10) || 0;
                                this.viewDate.setUTCFullYear(year)
                            }
                            if (this.viewMode !== 0) {
                                this._date = UTCDate(this.viewDate.getUTCFullYear(), this.viewDate.getUTCMonth(), this.viewDate.getUTCDate(), this._date.getUTCHours(), this._date.getUTCMinutes(), this._date.getUTCSeconds(), this._date.getUTCMilliseconds());
                                this.notifyChange()
                            }
                            this.showMode(-1);
                            this.fillDate();
                            this.set();
                            break;
                        case "td":
                            if (target.is(".day")) {
                                var day = parseInt(target.text(), 10) || 1;
                                var month = this.viewDate.getUTCMonth();
                                var year = this.viewDate.getUTCFullYear();
                                if (target.is(".old")) {
                                    if (month === 0) { month = 11; year -= 1 }
                                    else { month -= 1 }
                                } else if (target.is(".new")) {
                                    if (month == 11) { month = 0; year += 1 } else { month += 1 }
                                }
                                this._date = UTCDate(year, month, day, this._date.getUTCHours(), this._date.getUTCMinutes(), this._date.getUTCSeconds(), this._date.getUTCMilliseconds()); this.viewDate = UTCDate(year, month, Math.min(28, day), 0, 0, 0, 0);
                                this.fillDate();
                                this.set();
                                this.notifyChange();
                                $('.datepicker').parent().hide();
                            } break
                    }
                }
            }
        },
        actions: {
            incrementHours: function (e) {
                this.setValue(this._date.getTime());
                this._date.setUTCHours(this._date.getUTCHours() + 1)
            },
            incrementMinutes: function (e) {
                this.setValue(this._date.getTime());
                this._date.setUTCMinutes(this._date.getUTCMinutes() + 1)
            },
            incrementSeconds: function (e) {
                this.setValue(this._date.getTime());
                this._date.setUTCSeconds(this._date.getUTCSeconds() + 1)
            },
            decrementHours: function (e) {
                this.setValue(this._date.getTime());
                this._date.setUTCHours(this._date.getUTCHours() - 1)
            },
            decrementMinutes: function (e) {
                this.setValue(this._date.getTime());
                this._date.setUTCMinutes(this._date.getUTCMinutes() - 1)
            },
            decrementSeconds: function (e) {
                this.setValue(this._date.getTime());
                this._date.setUTCSeconds(this._date.getUTCSeconds() - 1)
            },
            togglePeriod: function (e) {
                this.setValue(this._date.getTime());
                var hour = this._date.getUTCHours(); if (hour >= 12) hour -= 12; else hour += 12; this._date.setUTCHours(hour)
            },
            showPicker: function () {
                this.widget.find(".timepicker > div:not(.timepicker-picker)").hide();
                this.widget.find(".timepicker .timepicker-picker").show();
            },
            showHours: function () {
                this.widget.find(".timepicker .timepicker-picker").hide();
                this.widget.find(".timepicker .timepicker-hours").show()
            },
            showMinutes: function () {
                this.widget.find(".timepicker .timepicker-picker").hide();
                this.widget.find(".timepicker .timepicker-minutes").show();
            },
            showSeconds: function () {
                this.widget.find(".timepicker .timepicker-picker").hide();
                this.widget.find(".timepicker .timepicker-seconds").show()
            },
            selectHour: function (e) {
                var tgt = $(e.target);
                var value = parseInt(tgt.text(), 10);
                if (this.options.pick12HourFormat) {
                    var current = this._date.getUTCHours();
                    if (current >= 12) { if (value != 12) value = (value + 12) % 24 } else { if (value === 12) value = 0; else value = value % 12 }
                }
                this._date.setUTCHours(value);
                this.actions.showPicker.call(this)
            },
            selectMinute: function (e) {
                var tgt = $(e.target);
                var value = parseInt(tgt.text(), 10);
                this._date.setUTCMinutes(value);
                this.actions.showPicker.call(this)
            },
            selectSecond: function (e) {
                var tgt = $(e.target);
                var value = parseInt(tgt.text(), 10);
                this._date.setUTCSeconds(value);
                this.actions.showPicker.call(this)
            }
        },
        doAction: function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (!this._date) this._date = UTCDate(1970, 0, 0, 0, 0, 0, 0);
            var action = $(e.currentTarget).data("action");
            var rv = this.actions[action].apply(this, arguments);
            this.set();
            this.fillTime();
            this.notifyChange();
            return rv
        },
        stopEvent: function (e) {
            e.stopPropagation();
            e.preventDefault();
        },
        keydown: function (e) {
            var self = this, k = e.which, input = $(e.target);
            if (k == 8 || k == 46) { setTimeout(function () { self._resetMaskPos(input) }) }
        },
        keypress: function (e) {
            var k = e.which;
            if (k == 8 || k == 46) { return }
            var input = $(e.target);
            var c = String.fromCharCode(k);
            var val = input.val() || "";
            val += c;
            var mask = this._mask[this._maskPos];
            if (!mask) { return false }
            if (mask.end != val.length) { return }
            if (!mask.pattern.test(val.slice(mask.start))) {
                val = val.slice(0, val.length - 1);
                while ((mask = this._mask[this._maskPos]) && mask.character) {
                    val += mask.character; this._maskPos++
                }
                val += c;
                if (mask.end != val.length) {
                    input.val(val); return false
                } else {
                    if (!mask.pattern.test(val.slice(mask.start))) {
                        input.val(val.slice(0, mask.start)); return false
                    } else { input.val(val); this._maskPos++; return false }
                }
            } else { this._maskPos++ }
        },
        change: function (e) {
            var input = $(e.target); var val = input.val();
            if (this._formatPattern.test(val)) {
                this.update();
                this.setValue(this._date.getTime()); this.notifyChange(); this.set()
            }
            else if (val && val.trim()) {
                this.setValue(this._date.getTime());
                if (this._date) this.set(); else input.val("")
            }
            else {
                if (this._date) { this.setValue(null); this.notifyChange(); this._unset = true }
            } this._resetMaskPos(input)
        },
        showMode: function (dir) {
            if (dir) { this.viewMode = Math.max(this.minViewMode, Math.min(2, this.viewMode + dir)) }
            //alert(this.widget.find(".datepicker > div").is(":visible"));
            //this.widget.find(".datepicker > div").hide().filter(".datepicker-" + DPGlobal.modes[this.viewMode].clsName).show()
        },
        destroy: function () {
            this._detachDatePickerEvents();
            this._detachDatePickerGlobalEvents();
            this.widget.remove();
            this.$element.removeData("datetimepicker");
            this.component.removeData("datetimepicker")
        },
        formatDate: function (d) {
            return this.format.replace(formatReplacer, function (match) {
                var methodName, property, rv, len = match.length;
                if (match === "ms") len = 1; property = dateFormatComponents[match].property;
                if (property === "Hours12") {
                    rv = d.getUTCHours();
                    if (rv === 0) rv = 12; else if (rv !== 12) rv = rv % 12
            }
            else if (property === "Period12") {
                if (d.getUTCHours() >= 12) return "PM";
                else return "AM"
            }
            else { methodName = "get" + property; rv = d[methodName]() }
                if (methodName === "getUTCMonth") rv = rv + 1;
                if (methodName === "getUTCYear") rv = rv + 1900 - 2e3;
                return padLeft(rv.toString(), len, "0")
            })
        },
        parseDate: function (str) {
            var match, i, property, methodName, value, parsed = {};
            if (!(match = this._formatPattern.exec(str))) return null;
            for (i = 1; i < match.length; i++) {
                property = this._propertiesByIndex[i];
                if (!property) continue; value = match[i];
                if (/^\d+$/.test(value)) value = parseInt(value, 10); parsed[property] = value
            }
            return this._finishParsingDate(parsed)
        },
        _resetMaskPos: function (input) {
            var val = input.val();
            for (var i = 0; i < this._mask.length; i++) {
                if (this._mask[i].end > val.length) {
                    this._maskPos = i; break
                }
                else if (this._mask[i].end === val.length) {
                    this._maskPos = i + 1; break
                }
            }
        },
        _finishParsingDate: function (parsed) {
            var year, month, date, hours, minutes, seconds, milliseconds; year = parsed.UTCFullYear;
            if (parsed.UTCYear) year = 2e3 + parsed.UTCYear;
            if (!year) year = 1970; if (parsed.UTCMonth) month = parsed.UTCMonth - 1;
            else month = 0; date = parsed.UTCDate || 1; hours = parsed.UTCHours || 0; minutes = parsed.UTCMinutes || 0; seconds = parsed.UTCSeconds || 0; milliseconds = parsed.UTCMilliseconds || 0;
            if (parsed.Hours12) { hours = parsed.Hours12 }
            if (parsed.Period12) {
                if (/pm/i.test(parsed.Period12)) {
                    if (hours != 12) hours = (hours + 12) % 24
                } else { hours = hours % 12 }
            }
            return UTCDate(year, month, date, hours, minutes, seconds, milliseconds)
        },
        _compileFormat: function () {
            var match, component, components = [], mask = [], str = this.format, propertiesByIndex = {}, i = 0, pos = 0;
            while (match = formatComponent.exec(str)) {
                component = match[0];
                if (component in dateFormatComponents) {
                    i++;
                    propertiesByIndex[i] = dateFormatComponents[component].property;
                    components.push("\\s*" + dateFormatComponents[component].getPattern(this) + "\\s*");
                    mask.push({
                        pattern: new RegExp(dateFormatComponents[component].getPattern(this)),
                        property: dateFormatComponents[component].property,
                        start: pos, end: pos += component.length
                    })
                } else {
                    components.push(escapeRegExp(component));
                    mask.push({ pattern: new RegExp(escapeRegExp(component)), character: component, start: pos, end: ++pos })
                }
                str = str.slice(component.length)
            }
            this._mask = mask;
            this._maskPos = 0;
            this._formatPattern = new RegExp("^\\s*" + components.join("") + "\\s*$");
            this._propertiesByIndex = propertiesByIndex
        },
        _attachDatePickerEvents: function () {
            var self = this;
            this.widget.on("click", ".datepicker *", $.proxy(this.click, this));
            this.widget.on("click", "[data-action]", $.proxy(this.doAction, this));
            this.widget.on("mousedown", $.proxy(this.stopEvent, this));
            if (this.pickDate && this.pickTime) {
                this.widget.on("click.togglePicker", ".accordion-toggle", function (e) {
                    e.stopPropagation();
                    var $this = $(this);
                    var $parent = $this.closest("ul");
                    var expanded = $parent.find(".collapse.in");
                    var closed = $parent.find(".collapse:not(.in)");
                    if (expanded && expanded.length) {
                        var collapseData = expanded.data("collapse");
                        if (collapseData && collapseData.transitioning) return;
                        expanded.collapse("hide");
                        closed.collapse("show");
                        $this.find("i").toggleClass(self.timeIcon + " " + self.dateIcon);
                        self.$element.find(".add-on i").toggleClass(self.timeIcon + " " + self.dateIcon)
                    }
                })
            }
            if (this.isInput) {
                this.$element.on({ focus: $.proxy(this.show, this), change: $.proxy(this.change, this) });
                if (this.options.maskInput) {
                    this.$element.on({
                        keydown: $.proxy(this.keydown, this),
                        keypress: $.proxy(this.keypress, this)
                    })
                }
            } else {
                this.$element.on({ change: $.proxy(this.change, this) }, "input");
                if (this.options.maskInput) {
                    this.$element.on({
                        keydown: $.proxy(this.keydown, this),
                        keypress: $.proxy(this.keypress, this)
                    }, "input")
                }
                if (this.component) {
                    this.component.on("click", $.proxy(this.show, this))
                } else {
                    this.$element.on("click", $.proxy(this.show, this))
                }
            }
        },
        _attachDatePickerGlobalEvents: function () {
            $(window).on("resize.datetimepicker" + this.id, $.proxy(this.place, this));
            if (!this.isInput) {
                //$(document).on("mousedown.datetimepicker" + this.id, $.proxy(this.hide, this))
            }
        },
        _detachDatePickerEvents: function () {
            this.widget.off("click", ".datepicker *", this.click);
            this.widget.off("click", "[data-action]");
            this.widget.off("mousedown", this.stopEvent);
            if (this.pickDate && this.pickTime) { this.widget.off("click.togglePicker") }
            if (this.isInput) {
                this.$element.off({
                    focus: this.show,
                    change: this.change
                });
                if (this.options.maskInput) {
                    this.$element.off({ keydown: this.keydown, keypress: this.keypress })
                }
            } else {
                this.$element.off({ change: this.change }, "input");
                if (this.options.maskInput) {
                    this.$element.off({ keydown: this.keydown, keypress: this.keypress }, "input")
                }
                if (this.component) {
                    this.component.off("click", this.show)
                } else { this.$element.off("click", this.show) }
            }
        },
        _detachDatePickerGlobalEvents: function () {
            $(window).off("resize.datetimepicker" + this.id); if (!this.isInput) { $(document).off("mousedown.datetimepicker" + this.id) }
        },
        _isInFixed: function () {
            if (this.$element) {
                var parents = this.$element.parents(); var inFixed = false;
                for (var i = 0; i < parents.length; i++) {
                    if ($(parents[i]).css("position") == "fixed") { inFixed = true; break }
                } return inFixed
            } else { return false }
        }
    };
    $.fn.datetimepicker = function (option, val) {
        return this.each(function () {
            var $this = $(this), data = $this.data("datetimepicker"), options = typeof option === "object" && option;
            if (!data) {
                $this.data("datetimepicker", data = new DateTimePicker(this, $.extend({}, $.fn.datetimepicker.defaults, options)))
            }
            if (typeof option === "string") data[option](val)
        })
    };
    $.fn.datetimepicker.defaults = {
        maskInput: false,
        pickDate: true,
        pickTime: true,
        pick12HourFormat: false,
        pickSeconds: true,
        startDate: -Infinity,
        endDate: Infinity,
        collapse: true
    };
    $.fn.datetimepicker.Constructor = DateTimePicker;
    var dpgId = 0;
    var dates = $.fn.datetimepicker.dates = {
        en: {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        }
    };
    var dateFormatComponents = {
        dd: { property: "UTCDate", getPattern: function () { return "(0?[1-9]|[1-2][0-9]|3[0-1])\\b" } },
        MM: {property: "UTCMonth", getPattern: function () { return "(0?[1-9]|1[0-2])\\b" } },
        yy: { property: "UTCYear", getPattern: function () { return "(\\d{2})\\b" } },
        yyyy: { property: "UTCFullYear", getPattern: function () { return "(\\d{4})\\b" } },
        hh: { property: "UTCHours", getPattern: function () { return "(0?[0-9]|1[0-9]|2[0-3])\\b" } },
        mm: { property: "UTCMinutes", getPattern: function () { return "(0?[0-9]|[1-5][0-9])\\b" } },
        ss: { property: "UTCSeconds", getPattern: function () { return "(0?[0-9]|[1-5][0-9])\\b" } },
        ms: { property: "UTCMilliseconds", getPattern: function () { return "([0-9]{1,3})\\b" } },
        HH: { property: "Hours12", getPattern: function () { return "(0?[1-9]|1[0-2])\\b" } },
        PP: { property: "Period12", getPattern: function () { return "(AM|PM|am|pm|Am|aM|Pm|pM)\\b" } }
    };
    var keys = [];
    for (var k in dateFormatComponents) keys.push(k);
    keys[keys.length - 1] += "\\b"; keys.push(".");
    var formatComponent = new RegExp(keys.join("\\b|"));
    keys.pop();
    var formatReplacer = new RegExp(keys.join("\\b|"), "g");
    function escapeRegExp(str) { return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") }
    function padLeft(s, l, c) { if (l < s.length) return s; else return Array(l - s.length + 1).join(c || " ") + s }
    function getTemplate(timeIcon, pickDate, pickTime, is12Hours, showSeconds, collapse) {
        if (pickDate && pickTime) {
            return '<div class="bootstrap-datetimepicker-widget dropdown-menu">' + "<ul>" + "<li" + (collapse ? ' class="collapse in"' : "") + ">" + '<div class="datepicker">' +
                DPGlobal.template + "</div>" + "</li>" + '<li class="picker-switch accordion-toggle"><a><i class="' + timeIcon + '"></i></a></li>' + "<li" + (collapse ? ' class="collapse"' : "") +
                ">" + '<div class="timepicker">' + TPGlobal.getTemplate(is12Hours, showSeconds) + "</div>" + "</li>" + "</ul>" + "</div>"
        } else if (pickTime) {
            return '<div class="bootstrap-datetimepicker-widget dropdown-menu">' + '<div class="timepicker">' + TPGlobal.getTemplate(is12Hours, showSeconds) + "</div>" + "</div>"
        } else {
            return '<div class="bootstrap-datetimepicker-widget dropdown-menu">' + '<div class="datepicker">' + DPGlobal.template + "</div>" + "</div>"
        }
    }
    function UTCDate() {
        return new Date(Date.UTC.apply(Date, arguments))
    }
    var DPGlobal = {
        modes: [{
            clsName: "days", navFnc: "UTCMonth", navStep: 1
        }, {
            clsName: "months", navFnc: "UTCFullYear", navStep: 1
        }, {
            clsName: "years", navFnc: "UTCFullYear", navStep: 10
        }],
        isLeapYear: function (year) { return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0 },
        getDaysInMonth: function (year, month) { return [31, DPGlobal.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] },
        headTemplate: "<thead>" + "<tr>" + '<th class="prev">&lsaquo;</th>' + '<th colspan="5" class="switch"></th>' + '<th class="next">&rsaquo;</th>' + "</tr>" + "</thead>",
        contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>'
    };
    DPGlobal.template = '<div class="datepicker-days">' + '<table class="table-condensed">' + DPGlobal.headTemplate + "<tbody></tbody>" + "</table>" + "</div>" +
        '<div class="datepicker-months">' + '<table class="table-condensed">' + DPGlobal.headTemplate + DPGlobal.contTemplate + "</table>" + "</div>" +
        '<div class="datepicker-years">' + '<table class="table-condensed">' + DPGlobal.headTemplate + DPGlobal.contTemplate + "</table>" + "</div>";
    var TPGlobal = {
        hourTemplate: '<span data-action="showHours" data-time-component="hours" class="timepicker-hour"></span>',
        minuteTemplate: '<span data-action="showMinutes" data-time-component="minutes" class="timepicker-minute"></span>',
        secondTemplate: '<span data-action="showSeconds" data-time-component="seconds" class="timepicker-second"></span>'
    };
    TPGlobal.getTemplate = function (is12Hours, showSeconds) {
        return '<div class="timepicker-picker">' + '<table class="table-condensed"' + (is12Hours ? 'data-hour-format="12"' : "") +
            ">" + "<tr>" + '<td><a href="#" class="btn btn-default" data-action="incrementHours" style="line-height: 1;"><img src="/images/icons/fa-chevron-up.png" alt="Increase Hours" style="max-width: 14px;" /></a></td>' +
            '<td class="separator"></td>' + '<td><a href="#" class="btn btn-default" data-action="incrementMinutes" style="line-height: 1;"><img src="/images/icons/fa-chevron-up.png" alt="Increase Minutes" style="max-width: 14px;" /></a></td>' +
            (showSeconds ? '<td class="separator"></td>' + '<td><a href="#" class="btn btn-default" data-action="incrementSeconds" style="line-height: 1;"><img src="/images/icons/fa-chevron-up.png" alt="Increase Seconds" style="max-width: 14px;" /></a></td>' : "") +
            (is12Hours ? '<td class="separator"></td>' : "") + "<td><a href='#' class='btn btn-default close-time' style='line-height: 1;'><img src='/images/icons/fa-close.png' alt='Close' style='max-width: 14px;' /></a></td></tr>" +

            "<tr>" + "<td>" + TPGlobal.hourTemplate + "</td> " + '<td class="separator">:</td>' +
            "<td>" + TPGlobal.minuteTemplate + "</td> " + (showSeconds ? '<td class="separator">:</td>' + "<td>" + TPGlobal.secondTemplate + "</td>" : "") +
            (is12Hours ? '<td class="separator"></td>' + "<td>" + '<button type="button" class="btn btn-default" data-action="togglePeriod"></button>' + "</td>" : "") +
            "</tr>" + "<tr>" + '<td><a href="#" class="btn btn-default" data-action="decrementHours" style="line-height: 1;"><img src="/images/icons/fa-chevron-down.png" alt="Decrease Hours" style="max-width: 14px;" /></a></td>' +
            '<td class="separator"></td>' + '<td><a href="#" class="btn btn-default" data-action="decrementMinutes" style="line-height: 1;"><img src="/images/icons/fa-chevron-down.png" alt="Decrease Hours" style="max-width: 14px;" /></a></td>' +
            (showSeconds ? '<td class="separator"></td>' + '<td><a href="#" class="btn" data-action="decrementSeconds" style="line-height: 1;"><img src="/images/icons/fa-chevron-down.png" alt="Decrease Hours" style="max-width: 14px;" /></a></td>' : "") +
            (is12Hours ? '<td class="separator"></td>' : "") + "</tr>" + "</table>" + "</div>" + '<div class="timepicker-hours" data-action="selectHour">' + '<table class="table-condensed">' +
            "</table>" + "</div>" + '<div class="timepicker-minutes" data-action="selectMinute">' + '<table class="table-condensed">' + "</table>" + "</div>" +
            (showSeconds ? '<div class="timepicker-seconds" data-action="selectSecond">' + '<table class="table-condensed">' + "</table>" + "</div>" : "")
    }
})(window.jQuery);




















//! moment.js
//! version : 2.7.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (undefined) {

    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = "2.7.0",
        // the global-scope this is NOT the global object in Node.js
        globalScope = typeof global !== 'undefined' ? global : this,
        oldGlobalMoment,
        round = Math.round,
        i,

        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

        // internal storage for language config files
        languages = {},

        // moment internal properties
        momentProperties = {
            _isAMomentObject: null,
            _i: null,
            _f: null,
            _l: null,
            _strict: null,
            _tzm: null,
            _isUTC: null,
            _offset: null,  // optional. Combine with _isUTC
            _pf: null,
            _lang: null  // optional
        },

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,

        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO separator)
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
        parseTokenOrdinal = /\d{1,2}/,

        //strict parsing regexes
        parseTokenOneDigit = /\d/, // 0 - 9
        parseTokenTwoDigits = /\d\d/, // 00 - 99
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf

        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,

        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d{2}/],
            ['YYYY-DDD', /\d{4}-\d{3}/]
        ],

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds': 1,
            'Seconds': 1e3,
            'Minutes': 6e4,
            'Hours': 36e5,
            'Days': 864e5,
            'Months': 2592e6,
            'Years': 31536e6
        },

        unitAliases = {
            ms: 'millisecond',
            s: 'second',
            m: 'minute',
            h: 'hour',
            d: 'day',
            D: 'date',
            w: 'week',
            W: 'isoWeek',
            M: 'month',
            Q: 'quarter',
            y: 'year',
            DDD: 'dayOfYear',
            e: 'weekday',
            E: 'isoWeekday',
            gg: 'weekYear',
            GG: 'isoWeekYear'
        },

        camelFunctions = {
            dayofyear: 'dayOfYear',
            isoweekday: 'isoWeekday',
            isoweek: 'isoWeek',
            weekyear: 'weekYear',
            isoweekyear: 'isoWeekYear'
        },

        // format function strings
        formatFunctions = {},

        // default relative time thresholds
        relativeTimeThresholds = {
            s: 45,   //seconds to minutes
            m: 45,   //minutes to hours
            h: 22,   //hours to days
            dd: 25,  //days to month (month == 1)
            dm: 45,  //days to months (months > 1)
            dy: 345  //days to year
        },

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M: function () {
                return this.month() + 1;
            },
            MMM: function (format) {
                return this.lang().monthsShort(this, format);
            },
            MMMM: function (format) {
                return this.lang().months(this, format);
            },
            D: function () {
                return this.date();
            },
            DDD: function () {
                return this.dayOfYear();
            },
            d: function () {
                return this.day();
            },
            dd: function (format) {
                return this.lang().weekdaysMin(this, format);
            },
            ddd: function (format) {
                return this.lang().weekdaysShort(this, format);
            },
            dddd: function (format) {
                return this.lang().weekdays(this, format);
            },
            w: function () {
                return this.week();
            },
            W: function () {
                return this.isoWeek();
            },
            YY: function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY: function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY: function () {
                return leftZeroFill(this.year(), 5);
            },
            YYYYYY: function () {
                var y = this.year(), sign = y >= 0 ? '+' : '-';
                return sign + leftZeroFill(Math.abs(y), 6);
            },
            gg: function () {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg: function () {
                return leftZeroFill(this.weekYear(), 4);
            },
            ggggg: function () {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG: function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG: function () {
                return leftZeroFill(this.isoWeekYear(), 4);
            },
            GGGGG: function () {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e: function () {
                return this.weekday();
            },
            E: function () {
                return this.isoWeekday();
            },
            a: function () {
                return this.lang().meridiem(this.hours(), this.minutes(), true);
            },
            A: function () {
                return this.lang().meridiem(this.hours(), this.minutes(), false);
            },
            H: function () {
                return this.hours();
            },
            h: function () {
                return this.hours() % 12 || 12;
            },
            m: function () {
                return this.minutes();
            },
            s: function () {
                return this.seconds();
            },
            S: function () {
                return toInt(this.milliseconds() / 100);
            },
            SS: function () {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            SSS: function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            SSSS: function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z: function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ":" + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ: function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
            },
            z: function () {
                return this.zoneAbbr();
            },
            zz: function () {
                return this.zoneName();
            },
            X: function () {
                return this.unix();
            },
            Q: function () {
                return this.quarter();
            }
        },

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];

    // Pick the first defined of two or three arguments. dfl comes from
    // default.
    function dfl(a, b, c) {
        switch (arguments.length) {
            case 2: return a != null ? a : b;
            case 3: return a != null ? a : b != null ? b : c;
            default: throw new Error("Implement me");
        }
    }

    function defaultParsingFlags() {
        // We need to deep clone this object, and es5 standard is not very
        // helpful.
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false
        };
    }

    function deprecate(msg, fn) {
        var firstTime = true;
        function printMsg() {
            if (moment.suppressDeprecationWarnings === false &&
                    typeof console !== 'undefined' && console.warn) {
                console.warn("Deprecation warning: " + msg);
            }
        }
        return extend(function () {
            if (firstTime) {
                printMsg();
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.lang().ordinal(func.call(this, a), period);
        };
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    /************************************
        Constructors
    ************************************/

    function Language() {

    }

    // Moment prototype object
    function Moment(config) {
        checkOverflow(config);
        extend(this, config);
    }

    // Duration Constructor
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._bubble();
    }

    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            }
        }

        if (b.hasOwnProperty("toString")) {
            a.toString = b.toString;
        }

        if (b.hasOwnProperty("valueOf")) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function cloneMoment(m) {
        var result = {}, i;
        for (i in m) {
            if (m.hasOwnProperty(i) && momentProperties.hasOwnProperty(i)) {
                result[i] = m[i];
            }
        }

        return result;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    // helper function for _.addTime and _.subtractTime
    function addOrSubtractDurationFromMoment(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            rawSetter(mom, 'Date', rawGetter(mom, 'Date') + days * isAdding);
        }
        if (months) {
            rawMonthSetter(mom, rawGetter(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            moment.updateOffset(mom, days || months);
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return Object.prototype.toString.call(input) === '[object Date]' ||
                input instanceof Date;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
            units = unitAliases[units] || camelFunctions[lowered] || lowered;
        }
        return units;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (inputObject.hasOwnProperty(prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeList(field) {
        var count, setter;

        if (field.indexOf('week') === 0) {
            count = 7;
            setter = 'day';
        }
        else if (field.indexOf('month') === 0) {
            count = 12;
            setter = 'month';
        }
        else {
            return;
        }

        moment[field] = function (format, index) {
            var i, getter,
                method = moment.fn._lang[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment.fn._lang, m, format || '');
            };

            if (index != null) {
                return getter(index);
            }
            else {
                for (i = 0; i < count; i++) {
                    results.push(getter(i));
                }
                return results;
            }
        };
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    function weeksInYear(year, dow, doy) {
        return weekOfYear(moment([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function checkOverflow(m) {
        var overflow;
        if (m._a && m._pf.overflow === -2) {
            overflow =
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                m._a[HOUR] < 0 || m._a[HOUR] > 23 ? HOUR :
                m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }
    }

    function isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0;
            }
        }
        return m._isValid;
    }

    function normalizeLanguage(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function makeAs(input, model) {
        return model._isUTC ? moment(input).zone(model._offset || 0) :
            moment(input).local();
    }

    /************************************
        Languages
    ************************************/


    extend(Language.prototype, {

        set: function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        },

        _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months: function (m) {
            return this._months[m.month()];
        },

        _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort: function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse: function (monthName) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                if (!this._monthsParse[i]) {
                    mom = moment.utc([2000, i]);
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays: function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort: function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin: function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse: function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat: {
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D YYYY",
            LLL: "MMMM D YYYY LT",
            LLLL: "dddd, MMMM D YYYY LT"
        },
        longDateFormat: function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        isPM: function (input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return ((input + '').toLowerCase().charAt(0) === 'p');
        },

        _meridiemParse: /[ap]\.?m?\.?/i,
        meridiem: function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },

        _calendar: {
            sameDay: '[Today at] LT',
            nextDay: '[Tomorrow at] LT',
            nextWeek: 'dddd [at] LT',
            lastDay: '[Yesterday at] LT',
            lastWeek: '[Last] dddd [at] LT',
            sameElse: 'L'
        },
        calendar: function (key, mom) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom) : output;
        },

        _relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        relativeTime: function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },
        pastFuture: function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal: function (number) {
            return this._ordinal.replace("%d", number);
        },
        _ordinal: "%d",

        preparse: function (string) {
            return string;
        },

        postformat: function (string) {
            return string;
        },

        week: function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },

        _week: {
            dow: 0, // Sunday is the first day of the week.
            doy: 6  // The week that contains Jan 1st is the first week of the year.
        },

        _invalidDate: 'Invalid date',
        invalidDate: function () {
            return this._invalidDate;
        }
    });

    // Loads a language definition into the `languages` cache.  The function
    // takes a key and optionally values.  If not in the browser and no values
    // are provided, it will load the language file module.  As a convenience,
    // this function also returns the language values.
    function loadLang(key, values) {
        values.abbr = key;
        if (!languages[key]) {
            languages[key] = new Language();
        }
        languages[key].set(values);
        return languages[key];
    }

    // Remove a language from the `languages` cache. Mostly useful in tests.
    function unloadLang(key) {
        delete languages[key];
    }

    // Determines which language definition to use and returns it.
    //
    // With no parameters, it will return the global language.  If you
    // pass in a language key, such as 'en', it will return the
    // definition for 'en', so long as 'en' has already been loaded using
    // moment.lang.
    function getLangDefinition(key) {
        var i = 0, j, lang, next, split,
            get = function (k) {
                if (!languages[k] && hasModule) {
                    try {
                        require('./lang/' + k);
                    } catch (e) { }
                }
                return languages[k];
            };

        if (!key) {
            return moment.fn._lang;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            lang = get(key);
            if (lang) {
                return lang;
            }
            key = [key];
        }

        //pick the language from the array
        //try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
        //substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
        while (i < key.length) {
            split = normalizeLanguage(key[i]).split('-');
            j = split.length;
            next = normalizeLanguage(key[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                lang = get(split.slice(0, j).join('-'));
                if (lang) {
                    return lang;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return moment.fn._lang;
    }

    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, "");
        }
        return input.replace(/\\/g, "");
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = "";
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {

        if (!m.isValid()) {
            return m.lang().invalidDate();
        }

        format = expandFormat(format, m.lang());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, lang) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return lang.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token, config) {
        var a, strict = config._strict;
        switch (token) {
            case 'Q':
                return parseTokenOneDigit;
            case 'DDDD':
                return parseTokenThreeDigits;
            case 'YYYY':
            case 'GGGG':
            case 'gggg':
                return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
            case 'Y':
            case 'G':
            case 'g':
                return parseTokenSignedNumber;
            case 'YYYYYY':
            case 'YYYYY':
            case 'GGGGG':
            case 'ggggg':
                return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
            case 'S':
                if (strict) { return parseTokenOneDigit; }
                /* falls through */
            case 'SS':
                if (strict) { return parseTokenTwoDigits; }
                /* falls through */
            case 'SSS':
                if (strict) { return parseTokenThreeDigits; }
                /* falls through */
            case 'DDD':
                return parseTokenOneToThreeDigits;
            case 'MMM':
            case 'MMMM':
            case 'dd':
            case 'ddd':
            case 'dddd':
                return parseTokenWord;
            case 'a':
            case 'A':
                return getLangDefinition(config._l)._meridiemParse;
            case 'X':
                return parseTokenTimestampMs;
            case 'Z':
            case 'ZZ':
                return parseTokenTimezone;
            case 'T':
                return parseTokenT;
            case 'SSSS':
                return parseTokenDigits;
            case 'MM':
            case 'DD':
            case 'YY':
            case 'GG':
            case 'gg':
            case 'HH':
            case 'hh':
            case 'mm':
            case 'ss':
            case 'ww':
            case 'WW':
                return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
            case 'M':
            case 'D':
            case 'd':
            case 'H':
            case 'h':
            case 'm':
            case 's':
            case 'w':
            case 'W':
            case 'e':
            case 'E':
                return parseTokenOneOrTwoDigits;
            case 'Do':
                return parseTokenOrdinal;
            default:
                a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), "i"));
                return a;
        }
    }

    function timezoneMinutesFromString(string) {
        string = string || "";
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? -minutes : minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;

        switch (token) {
            // QUARTER
            case 'Q':
                if (input != null) {
                    datePartArray[MONTH] = (toInt(input) - 1) * 3;
                }
                break;
                // MONTH
            case 'M': // fall through to MM
            case 'MM':
                if (input != null) {
                    datePartArray[MONTH] = toInt(input) - 1;
                }
                break;
            case 'MMM': // fall through to MMMM
            case 'MMMM':
                a = getLangDefinition(config._l).monthsParse(input);
                // if we didn't find a month name, mark the date as invalid.
                if (a != null) {
                    datePartArray[MONTH] = a;
                } else {
                    config._pf.invalidMonth = input;
                }
                break;
                // DAY OF MONTH
            case 'D': // fall through to DD
            case 'DD':
                if (input != null) {
                    datePartArray[DATE] = toInt(input);
                }
                break;
            case 'Do':
                if (input != null) {
                    datePartArray[DATE] = toInt(parseInt(input, 10));
                }
                break;
                // DAY OF YEAR
            case 'DDD': // fall through to DDDD
            case 'DDDD':
                if (input != null) {
                    config._dayOfYear = toInt(input);
                }

                break;
                // YEAR
            case 'YY':
                datePartArray[YEAR] = moment.parseTwoDigitYear(input);
                break;
            case 'YYYY':
            case 'YYYYY':
            case 'YYYYYY':
                datePartArray[YEAR] = toInt(input);
                break;
                // AM / PM
            case 'a': // fall through to A
            case 'A':
                config._isPm = getLangDefinition(config._l).isPM(input);
                break;
                // 24 HOUR
            case 'H': // fall through to hh
            case 'HH': // fall through to hh
            case 'h': // fall through to hh
            case 'hh':
                datePartArray[HOUR] = toInt(input);
                break;
                // MINUTE
            case 'm': // fall through to mm
            case 'mm':
                datePartArray[MINUTE] = toInt(input);
                break;
                // SECOND
            case 's': // fall through to ss
            case 'ss':
                datePartArray[SECOND] = toInt(input);
                break;
                // MILLISECOND
            case 'S':
            case 'SS':
            case 'SSS':
            case 'SSSS':
                datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
                break;
                // UNIX TIMESTAMP WITH MS
            case 'X':
                config._d = new Date(parseFloat(input) * 1000);
                break;
                // TIMEZONE
            case 'Z': // fall through to ZZ
            case 'ZZ':
                config._useUTC = true;
                config._tzm = timezoneMinutesFromString(input);
                break;
                // WEEKDAY - human
            case 'dd':
            case 'ddd':
            case 'dddd':
                a = getLangDefinition(config._l).weekdaysParse(input);
                // if we didn't get a weekday name, mark the date as invalid
                if (a != null) {
                    config._w = config._w || {};
                    config._w['d'] = a;
                } else {
                    config._pf.invalidWeekday = input;
                }
                break;
                // WEEK, WEEK DAY - numeric
            case 'w':
            case 'ww':
            case 'W':
            case 'WW':
            case 'd':
            case 'e':
            case 'E':
                token = token.substr(0, 1);
                /* falls through */
            case 'gggg':
            case 'GGGG':
            case 'GGGGG':
                token = token.substr(0, 2);
                if (input) {
                    config._w = config._w || {};
                    config._w[token] = toInt(input);
                }
                break;
            case 'gg':
            case 'GG':
                config._w = config._w || {};
                config._w[token] = moment.parseTwoDigitYear(input);
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, lang;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = dfl(w.GG, config._a[YEAR], weekOfYear(moment(), 1, 4).year);
            week = dfl(w.W, 1);
            weekday = dfl(w.E, 1);
        } else {
            lang = getLangDefinition(config._l);
            dow = lang._week.dow;
            doy = lang._week.doy;

            weekYear = dfl(w.gg, config._a[YEAR], weekOfYear(moment(), dow, doy).year);
            week = dfl(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromConfig(config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = dfl(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
        // Apply timezone offset from input. The actual zone can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() + config._tzm);
        }
    }

    function dateFromObject(config) {
        var normalizedInput;

        if (config._d) {
            return;
        }

        normalizedInput = normalizeObjectUnits(config._i);
        config._a = [
            normalizedInput.year,
            normalizedInput.month,
            normalizedInput.day,
            normalizedInput.hour,
            normalizedInput.minute,
            normalizedInput.second,
            normalizedInput.millisecond
        ];

        dateFromConfig(config);
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ];
        } else {
            return [now.getFullYear(), now.getMonth(), now.getDate()];
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {

        if (config._f === moment.ISO_8601) {
            parseISO(config);
            return;
        }

        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var lang = getLangDefinition(config._l),
            string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, lang).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // handle am pm
        if (config._isPm && config._a[HOUR] < 12) {
            config._a[HOUR] += 12;
        }
        // if is 12 am, change hours to 0
        if (config._isPm === false && config._a[HOUR] === 12) {
            config._a[HOUR] = 0;
        }

        dateFromConfig(config);
        checkOverflow(config);
    }

    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = extend({}, config);
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    // date from iso format
    function parseISO(config) {
        var i, l,
            string = config._i,
            match = isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be "T" or undefined
                    config._f = isoDates[i][0] + (match[6] || " ");
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(parseTokenTimezone)) {
                config._f += "Z";
            }
            makeDateFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function makeDateFromString(config) {
        parseISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            moment.createFromInputFallback(config);
        }
    }

    function makeDateFromInput(config) {
        var input = config._i,
            matched = aspNetJsonRegex.exec(input);

        if (input === undefined) {
            config._d = new Date();
        } else if (matched) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = input.slice(0);
            dateFromConfig(config);
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof (input) === 'object') {
            dateFromObject(config);
        } else if (typeof (input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            moment.createFromInputFallback(config);
        }
    }

    function makeDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    function parseWeekday(input, language) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = language.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    /************************************
        Relative Time
    ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
        return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(milliseconds, withoutSuffix, lang) {
        var seconds = round(Math.abs(milliseconds) / 1000),
            minutes = round(seconds / 60),
            hours = round(minutes / 60),
            days = round(hours / 24),
            years = round(days / 365),
            args = seconds < relativeTimeThresholds.s && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < relativeTimeThresholds.m && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < relativeTimeThresholds.h && ['hh', hours] ||
                days === 1 && ['d'] ||
                days <= relativeTimeThresholds.dd && ['dd', days] ||
                days <= relativeTimeThresholds.dm && ['M'] ||
                days < relativeTimeThresholds.dy && ['MM', round(days / 30)] ||
                years === 1 && ['y'] || ['yy', years];
        args[2] = withoutSuffix;
        args[3] = milliseconds > 0;
        args[4] = lang;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
        Week of Year
    ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = moment(mom).add('d', daysToDayOfWeek);
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;

        d = d === 0 ? 7 : d;
        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ? dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    /************************************
        Top Level Functions
    ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f;

        if (input === null || (format === undefined && input === '')) {
            return moment.invalid({ nullInput: true });
        }

        if (typeof input === 'string') {
            config._i = input = getLangDefinition().preparse(input);
        }

        if (moment.isMoment(input)) {
            config = cloneMoment(input);

            config._d = new Date(+input._d);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        return new Moment(config);
    }

    moment = function (input, format, lang, strict) {
        var c;

        if (typeof (lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._i = input;
        c._f = format;
        c._l = lang;
        c._strict = strict;
        c._isUTC = false;
        c._pf = defaultParsingFlags();

        return makeMoment(c);
    };

    moment.suppressDeprecationWarnings = false;

    moment.createFromInputFallback = deprecate(
            "moment construction falls back to js Date. This is " +
            "discouraged and will be removed in upcoming major " +
            "release. Please refer to " +
            "https://github.com/moment/moment/issues/1407 for more info.",
            function (config) {
                config._d = new Date(config._i);
            });

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return moment();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    moment.min = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    };

    moment.max = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    };

    // creating with utc
    moment.utc = function (input, format, lang, strict) {
        var c;

        if (typeof (lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._useUTC = true;
        c._isUTC = true;
        c._l = lang;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();

        return makeMoment(c).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            parseIso;

        if (moment.isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoDurationRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            parseIso = function (inp) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            };
            duration = {
                y: parseIso(match[2]),
                M: parseIso(match[3]),
                d: parseIso(match[4]),
                h: parseIso(match[5]),
                m: parseIso(match[6]),
                s: parseIso(match[7]),
                w: parseIso(match[8])
            };
        }

        ret = new Duration(duration);

        if (moment.isDuration(input) && input.hasOwnProperty('_lang')) {
            ret._lang = input._lang;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // constant that refers to the ISO standard
    moment.ISO_8601 = function () { };

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    moment.momentProperties = momentProperties;

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    moment.updateOffset = function () { };

    // This function allows you to set a threshold for relative time strings
    moment.relativeTimeThreshold = function (threshold, limit) {
        if (relativeTimeThresholds[threshold] === undefined) {
            return false;
        }
        relativeTimeThresholds[threshold] = limit;
        return true;
    };

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    moment.lang = function (key, values) {
        var r;
        if (!key) {
            return moment.fn._lang._abbr;
        }
        if (values) {
            loadLang(normalizeLanguage(key), values);
        } else if (values === null) {
            unloadLang(key);
            key = 'en';
        } else if (!languages[key]) {
            getLangDefinition(key);
        }
        r = moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);
        return r._abbr;
    };

    // returns language data
    moment.langData = function (key) {
        if (key && key._lang && key._lang._abbr) {
            key = key._lang._abbr;
        }
        return getLangDefinition(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment ||
            (obj != null && obj.hasOwnProperty('_isAMomentObject'));
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    for (i = lists.length - 1; i >= 0; --i) {
        makeList(lists[i]);
    }

    moment.normalizeUnits = function (units) {
        return normalizeUnits(units);
    };

    moment.invalid = function (flags) {
        var m = moment.utc(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    };

    moment.parseZone = function () {
        return moment.apply(null, arguments).parseZone();
    };

    moment.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    /************************************
        Moment Prototype
    ************************************/


    extend(moment.fn = Moment.prototype, {

        clone: function () {
            return moment(this);
        },

        valueOf: function () {
            return +this._d + ((this._offset || 0) * 60000);
        },

        unix: function () {
            return Math.floor(+this / 1000);
        },

        toString: function () {
            return this.clone().lang('en').format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
        },

        toDate: function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toISOString: function () {
            var m = moment(this).utc();
            if (0 < m.year() && m.year() <= 9999) {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            } else {
                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        },

        toArray: function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid: function () {
            return isValid(this);
        },

        isDSTShifted: function () {

            if (this._a) {
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }

            return false;
        },

        parsingFlags: function () {
            return extend({}, this._pf);
        },

        invalidAt: function () {
            return this._pf.overflow;
        },

        utc: function () {
            return this.zone(0);
        },

        local: function () {
            this.zone(0);
            this._isUTC = false;
            return this;
        },

        format: function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.lang().postformat(output);
        },

        add: function (input, val) {
            var dur;
            // switch args to support add('s', 1) and add(1, 's')
            if (typeof input === 'string' && typeof val === 'string') {
                dur = moment.duration(isNaN(+val) ? +input : +val, isNaN(+val) ? val : input);
            } else if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, 1);
            return this;
        },

        subtract: function (input, val) {
            var dur;
            // switch args to support subtract('s', 1) and subtract(1, 's')
            if (typeof input === 'string' && typeof val === 'string') {
                dur = moment.duration(isNaN(+val) ? +input : +val, isNaN(+val) ? val : input);
            } else if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, -1);
            return this;
        },

        diff: function (input, units, asFloat) {
            var that = makeAs(input, this),
                zoneDiff = (this.zone() - that.zone()) * 6e4,
                diff, output;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month') {
                // average number of days in the months in the given dates
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
                // difference in months
                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
                // adjust by taking difference in days, average number of days
                // and dst in the given months.
                output += ((this - moment(this).startOf('month')) -
                        (that - moment(that).startOf('month'))) / diff;
                // same as above but with zones, to negate all dst
                output -= ((this.zone() - moment(this).startOf('month').zone()) -
                        (that.zone() - moment(that).startOf('month').zone())) * 6e4 / diff;
                if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = (this - that);
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                    units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                    units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from: function (time, withoutSuffix) {
            return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);
        },

        fromNow: function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar: function (time) {
            // We want to compare the start of today, vs this.
            // Getting start-of-today depends on whether we're zone'd or not.
            var now = time || moment(),
                sod = makeAs(now, this).startOf('day'),
                diff = this.diff(sod, 'days', true),
                format = diff < -6 ? 'sameElse' :
                    diff < -1 ? 'lastWeek' :
                    diff < 0 ? 'lastDay' :
                    diff < 1 ? 'sameDay' :
                    diff < 2 ? 'nextDay' :
                    diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.lang().calendar(format, this));
        },

        isLeapYear: function () {
            return isLeapYear(this.year());
        },

        isDST: function () {
            return (this.zone() < this.clone().month(0).zone() ||
                this.zone() < this.clone().month(5).zone());
        },

        day: function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.lang());
                return this.add({ d: input - day });
            } else {
                return day;
            }
        },

        month: makeAccessor('Month', true),

        startOf: function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
                case 'year':
                    this.month(0);
                    /* falls through */
                case 'quarter':
                case 'month':
                    this.date(1);
                    /* falls through */
                case 'week':
                case 'isoWeek':
                case 'day':
                    this.hours(0);
                    /* falls through */
                case 'hour':
                    this.minutes(0);
                    /* falls through */
                case 'minute':
                    this.seconds(0);
                    /* falls through */
                case 'second':
                    this.milliseconds(0);
                    /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            } else if (units === 'isoWeek') {
                this.isoWeekday(1);
            }

            // quarters are also special
            if (units === 'quarter') {
                this.month(Math.floor(this.month() / 3) * 3);
            }

            return this;
        },

        endOf: function (units) {
            units = normalizeUnits(units);
            return this.startOf(units).add((units === 'isoWeek' ? 'week' : units), 1).subtract('ms', 1);
        },

        isAfter: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) > +moment(input).startOf(units);
        },

        isBefore: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) < +moment(input).startOf(units);
        },

        isSame: function (input, units) {
            units = units || 'ms';
            return +this.clone().startOf(units) === +makeAs(input, this).startOf(units);
        },

        min: deprecate(
                 "moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548",
                 function (other) {
                     other = moment.apply(null, arguments);
                     return other < this ? this : other;
                 }
         ),

        max: deprecate(
                "moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548",
                function (other) {
                    other = moment.apply(null, arguments);
                    return other > this ? this : other;
                }
        ),

        // keepTime = true means only change the timezone, without affecting
        // the local hour. So 5:31:26 +0300 --[zone(2, true)]--> 5:31:26 +0200
        // It is possible that 5:31:26 doesn't exist int zone +0200, so we
        // adjust the time as needed, to be valid.
        //
        // Keeping the time actually adds/subtracts (one hour)
        // from the actual represented time. That is why we call updateOffset
        // a second time. In case it wants us to change the offset again
        // _changeInProgress == true case, then we have to adjust, because
        // there is no such time in the given timezone.
        zone: function (input, keepTime) {
            var offset = this._offset || 0;
            if (input != null) {
                if (typeof input === "string") {
                    input = timezoneMinutesFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                this._offset = input;
                this._isUTC = true;
                if (offset !== input) {
                    if (!keepTime || this._changeInProgress) {
                        addOrSubtractDurationFromMoment(this,
                                moment.duration(offset - input, 'm'), 1, false);
                    } else if (!this._changeInProgress) {
                        this._changeInProgress = true;
                        moment.updateOffset(this, true);
                        this._changeInProgress = null;
                    }
                }
            } else {
                return this._isUTC ? offset : this._d.getTimezoneOffset();
            }
            return this;
        },

        zoneAbbr: function () {
            return this._isUTC ? "UTC" : "";
        },

        zoneName: function () {
            return this._isUTC ? "Coordinated Universal Time" : "";
        },

        parseZone: function () {
            if (this._tzm) {
                this.zone(this._tzm);
            } else if (typeof this._i === 'string') {
                this.zone(this._i);
            }
            return this;
        },

        hasAlignedHourOffset: function (input) {
            if (!input) {
                input = 0;
            }
            else {
                input = moment(input).zone();
            }

            return (this.zone() - input) % 60 === 0;
        },

        daysInMonth: function () {
            return daysInMonth(this.year(), this.month());
        },

        dayOfYear: function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add("d", (input - dayOfYear));
        },

        quarter: function (input) {
            return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
        },

        weekYear: function (input) {
            var year = weekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).year;
            return input == null ? year : this.add("y", (input - year));
        },

        isoWeekYear: function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add("y", (input - year));
        },

        week: function (input) {
            var week = this.lang().week(this);
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        isoWeek: function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        weekday: function (input) {
            var weekday = (this.day() + 7 - this.lang()._week.dow) % 7;
            return input == null ? weekday : this.add("d", input - weekday);
        },

        isoWeekday: function (input) {
            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },

        isoWeeksInYear: function () {
            return weeksInYear(this.year(), 1, 4);
        },

        weeksInYear: function () {
            var weekInfo = this._lang._week;
            return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
        },

        get: function (units) {
            units = normalizeUnits(units);
            return this[units]();
        },

        set: function (units, value) {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                this[units](value);
            }
            return this;
        },

        // If passed a language key, it will set the language for this
        // instance.  Otherwise, it will return the language configuration
        // variables for this instance.
        lang: function (key) {
            if (key === undefined) {
                return this._lang;
            } else {
                this._lang = getLangDefinition(key);
                return this;
            }
        }
    });

    function rawMonthSetter(mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.lang().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(),
                daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function rawGetter(mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function rawSetter(mom, unit, value) {
        if (unit === 'Month') {
            return rawMonthSetter(mom, value);
        } else {
            return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    function makeAccessor(unit, keepTime) {
        return function (value) {
            if (value != null) {
                rawSetter(this, unit, value);
                moment.updateOffset(this, keepTime);
                return this;
            } else {
                return rawGetter(this, unit);
            }
        };
    }

    moment.fn.millisecond = moment.fn.milliseconds = makeAccessor('Milliseconds', false);
    moment.fn.second = moment.fn.seconds = makeAccessor('Seconds', false);
    moment.fn.minute = moment.fn.minutes = makeAccessor('Minutes', false);
    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    moment.fn.hour = moment.fn.hours = makeAccessor('Hours', true);
    // moment.fn.month is defined separately
    moment.fn.date = makeAccessor('Date', true);
    moment.fn.dates = deprecate("dates accessor is deprecated. Use date instead.", makeAccessor('Date', true));
    moment.fn.year = makeAccessor('FullYear', true);
    moment.fn.years = deprecate("years accessor is deprecated. Use year instead.", makeAccessor('FullYear', true));

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;
    moment.fn.quarters = moment.fn.quarter;

    // add aliased format methods
    moment.fn.toJSON = moment.fn.toISOString;

    /************************************
        Duration Prototype
    ************************************/


    extend(moment.duration.fn = Duration.prototype, {

        _bubble: function () {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds, minutes, hours, years;

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absRound(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absRound(seconds / 60);
            data.minutes = minutes % 60;

            hours = absRound(minutes / 60);
            data.hours = hours % 24;

            days += absRound(hours / 24);
            data.days = days % 30;

            months += absRound(days / 30);
            data.months = months % 12;

            years = absRound(months / 12);
            data.years = years;
        },

        weeks: function () {
            return absRound(this.days() / 7);
        },

        valueOf: function () {
            return this._milliseconds +
              this._days * 864e5 +
              (this._months % 12) * 2592e6 +
              toInt(this._months / 12) * 31536e6;
        },

        humanize: function (withSuffix) {
            var difference = +this,
                output = relativeTime(difference, !withSuffix, this.lang());

            if (withSuffix) {
                output = this.lang().pastFuture(difference, output);
            }

            return this.lang().postformat(output);
        },

        add: function (input, val) {
            // supports only 2.0-style add(1, 's') or add(moment)
            var dur = moment.duration(input, val);

            this._milliseconds += dur._milliseconds;
            this._days += dur._days;
            this._months += dur._months;

            this._bubble();

            return this;
        },

        subtract: function (input, val) {
            var dur = moment.duration(input, val);

            this._milliseconds -= dur._milliseconds;
            this._days -= dur._days;
            this._months -= dur._months;

            this._bubble();

            return this;
        },

        get: function (units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + 's']();
        },

        as: function (units) {
            units = normalizeUnits(units);
            return this['as' + units.charAt(0).toUpperCase() + units.slice(1) + 's']();
        },

        lang: moment.fn.lang,

        toIsoString: function () {
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            var years = Math.abs(this.years()),
                months = Math.abs(this.months()),
                days = Math.abs(this.days()),
                hours = Math.abs(this.hours()),
                minutes = Math.abs(this.minutes()),
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);

            if (!this.asSeconds()) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            return (this.asSeconds() < 0 ? '-' : '') +
                'P' +
                (years ? years + 'Y' : '') +
                (months ? months + 'M' : '') +
                (days ? days + 'D' : '') +
                ((hours || minutes || seconds) ? 'T' : '') +
                (hours ? hours + 'H' : '') +
                (minutes ? minutes + 'M' : '') +
                (seconds ? seconds + 'S' : '');
        }
    });

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    function makeDurationAsGetter(name, factor) {
        moment.duration.fn['as' + name] = function () {
            return +this / factor;
        };
    }

    for (i in unitMillisecondFactors) {
        if (unitMillisecondFactors.hasOwnProperty(i)) {
            makeDurationAsGetter(i, unitMillisecondFactors[i]);
            makeDurationGetter(i.toLowerCase());
        }
    }

    makeDurationAsGetter('Weeks', 6048e5);
    moment.duration.fn.asMonths = function () {
        return (+this - this.years() * 31536e6) / 2592e6 + this.years() * 12;
    };


    /************************************
        Default Lang
    ************************************/


    // Set default language, other languages will inherit from English.
    moment.lang('en', {
        ordinal: function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    /* EMBED_LANGUAGES */

    /************************************
        Exposing Moment
    ************************************/

    function makeGlobal(shouldDeprecate) {
        /*global ender:false */
        if (typeof ender !== 'undefined') {
            return;
        }
        oldGlobalMoment = globalScope.moment;
        if (shouldDeprecate) {
            globalScope.moment = deprecate(
                    "Accessing Moment through the global scope is " +
                    "deprecated, and will be removed in an upcoming " +
                    "release.",
                    moment);
        } else {
            globalScope.moment = moment;
        }
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
    } else if (typeof define === "function" && define.amd) {
        define("moment", function (require, exports, module) {
            if (module.config && module.config() && module.config().noGlobal === true) {
                // release the global variable
                globalScope.moment = oldGlobalMoment;
            }

            return moment;
        });
        makeGlobal(true);
    } else {
        makeGlobal();
    }
}).call(this);
