/**
 * Formats a date string to a localized date format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString){
    try {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

/**
 * Formats a number as currency
 * @param amount Number to format
 * @param currency Currency code
 * @returns Formatted currency string
 */
export function formatCurrency(amount, currency = 'VND') {
    try {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency
        }).format(amount);
    } catch (error) {
        console.error('Error formatting currency:', error);
        return `${amount} ${currency}`;
    }
}