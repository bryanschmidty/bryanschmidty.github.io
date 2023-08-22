// Get table contents
const table = document.querySelector('table');

// Extract headers
const headers = ['Name', 'Household', 'Gender', 'Age', 'Birth Date', 'Address', 'Phone', 'Email'];

// Extract rows
const rows = Array.from(table.querySelectorAll('tr'))
    .slice(1)
    .map(row => {

        const nameTd = row.querySelector('td.n.fn');
        const nameSpan = nameTd.querySelector('member-card ng-transclude span');
        const householdSpan = nameTd.children[1];

        return [
            nameSpan.textContent.trim(),
            householdSpan.textContent.trim(),

            row.querySelector('td.sex:not(.hidden)').textContent.trim(),
            row.querySelector('td.age:not(.hidden)').textContent.trim(),
            row.querySelector('td.birthdate:not(.hidden)').textContent.trim(),

            row.querySelector('td[ng-bind-html]:not(.hidden)')
                .innerHTML.replace(/<br>/g, ', '),

            row.querySelector('td.phone:not(.hidden) a').textContent.trim(),
            row.querySelector('td.email:not(.hidden) a').textContent.trim()
        ];
    })
    .map(row => row.map(cell => `"${cell}"`));

// Generate CSV
let csv = [headers.join(',')];
rows.forEach(row => {
    csv.push(row.join(','));
});
csv = csv.join('\n');

// Download CSV
const blob = new Blob([csv], {type: 'text/csv'});
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.setAttribute('href', url);
link.setAttribute('download', 'data.csv');
document.body.appendChild(link); // Required for FF
link.click();