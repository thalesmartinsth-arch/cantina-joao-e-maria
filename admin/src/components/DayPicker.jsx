import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './DayPicker.css';

const DayPicker = ({ selectedDate, onSelect, activityMap = new Set() }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
    const scrollRef = useRef(null);

    useEffect(() => {
        // Scroll to selected date on mount or when month changes
        if (scrollRef.current) {
            const selectedEl = scrollRef.current.querySelector('.day-pill.selected');
            if (selectedEl) {
                selectedEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    }, [selectedDate, currentMonth]);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        return Array.from({ length: days }, (_, i) => {
            return new Date(year, month, i + 1);
        });
    };

    const days = getDaysInMonth(currentMonth);

    const handlePrevMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const isSameDay = (d1, d2) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    const formatDateKey = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

    return (
        <div className="day-picker-container">
            <div className="month-navigation">
                <h3>Sua Agenda</h3>
                <div className="nav-controls">
                    <button onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
                    <span>
                        {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={handleNextMonth}><ChevronRight size={20} /></button>
                </div>
            </div>

            <div className="days-scroll-wrapper" ref={scrollRef}>
                <div className="days-track">
                    {days.map(date => {
                        const isSelected = isSameDay(date, selectedDate);
                        const dateKey = formatDateKey(date);
                        const hasActivity = activityMap.has(dateKey);
                        const isToday = isSameDay(date, new Date());

                        return (
                            <button
                                key={dateKey}
                                className={`day-pill ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                                onClick={() => onSelect(date)}
                            >
                                <span className="day-label">{weekDays[date.getDay()]}</span>
                                <span className="day-number">{date.getDate()}</span>
                                {hasActivity && <span className="activity-dot"></span>}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DayPicker;
