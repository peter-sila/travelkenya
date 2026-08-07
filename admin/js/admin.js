const form = document.getElementById('createTourForm');
const status = document.getElementById('createStatus');
form.addEventListener('submit', e => {
  e.preventDefault();
  const fd = new FormData(form);
  const payload = {};
  fd.forEach((v,k) => payload[k]=v);
  fetch('../backend_php/admin_create_tour.php', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  }).then(r=>r.json()).then(j=>{
    if (j.success) status.textContent = 'Created.';
    else status.textContent = j.error || 'Failed';
  }).catch(err=>{status.textContent='Error';console.error(err)});
});
