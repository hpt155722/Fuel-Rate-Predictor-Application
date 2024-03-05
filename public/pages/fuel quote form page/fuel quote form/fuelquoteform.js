document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('fuelQuoteForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); 
        const gallonsRequested = parseFloat(document.getElementById('gallonsRequested').value);
        const suggestedPrice = parseFloat(document.getElementById('suggestedPrice').value);
        const totalAmountDue = gallonsRequested * suggestedPrice;
        document.getElementById('totalAmountDue').value = totalAmountDue.toFixed(2);
    });
});
