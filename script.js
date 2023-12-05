// dropdown.js
function closeDropdown() {
  document.getElementById('statusDropdownMenu').setAttribute('aria-expanded', 'false');
}

document.addEventListener('DOMContentLoaded', function() {
// Menutup drop-down saat dokumen dimuat
  closeDropdown();
});

function changeStatus(status) {
  document.getElementById('selectedStatus').innerText = status;
  closeDropdown(); // Menyembunyikan drop-down setelah memilih
// Lakukan tindakan tambahan berdasarkan status yang dipilih
}
// Function CAPSLOCK Input ID
function toUpperCase(input) {
        input.value = input.value.toUpperCase();
}

function toggleDropdown() {
  var menu = document.getElementById('statusDropdownMenu');
  var dropdownContent = document.querySelector('.dropdown-content'); // Tambahkan ini

  var expanded = menu.getAttribute('aria-expanded') === 'true';

  if (!expanded) {
    menu.setAttribute('aria-expanded', 'true');
    dropdownContent.style.display = 'block'; // Tampilkan dropdown
  } else {
    menu.setAttribute('aria-expanded', 'false');
    dropdownContent.style.display = 'none'; // Sembunyikan dropdown
  }
}
// JWT token 
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYjhkMDQ1OS01NDc5LTRkZDctOGZmMC01MDQzYmYwZDQ3YzUiLCJuYW1lIjoiRGFuYXIgUmFmaWFyZGkgQWhtYWQiLCJleHAiOjE3MzMyMjg2MjR9.Gyu5cWfrUOaRd-LV0iIi1SL4FfWAuwzHI2aBKStwLv0';

// Card Fetching data
const apiUrlOrderCount = 'https://thrivein-api-v1-ihovaneucq-et.a.run.app/order-count';

document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Fetch order count data
        const responseOrderCount = await fetch(apiUrlOrderCount, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!responseOrderCount.ok) {
            throw new Error(`Network response was not ok (${responseOrderCount.status} ${responseOrderCount.statusText})`);
        }

        const orderCountData = await responseOrderCount.json();

        // Display hasil data fetch
        const baruElement = document.getElementById('baruCount');
        baruElement.textContent = orderCountData.baru;

        const diprosesElement = document.getElementById('diprosesCount');
        diprosesElement.textContent = orderCountData.diproses;

        const selesaiElement = document.getElementById('selesaiCount');
        selesaiElement.textContent = orderCountData.selesai;

        // Jumlah semua
        const totalSalesElement = document.getElementById('totalSales');
        const totalSales = orderCountData.baru + orderCountData.diproses + orderCountData.selesai;
        totalSalesElement.textContent = totalSales;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
});


// Hitung jumlah user App
const apiUrlUserCount = 'https://thrivein-api-v1-ihovaneucq-et.a.run.app/user-count';
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Fetch user count data
        const responseUserCount = await fetch(apiUrlUserCount, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!responseUserCount.ok) {
            throw new Error(`Network response was not ok (${responseUserCount.status} ${responseUserCount.statusText})`);
        }

        const userCountData = await responseUserCount.json();

        // Update HTML to display total user count
        const totalUserElement = document.getElementById('totalUser');
        totalUserElement.textContent = userCountData.user;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

//Fetching data banners
document.addEventListener('DOMContentLoaded', async function () {
  const apiUrl = 'https://thrivein-api-v1-ihovaneucq-et.a.run.app/banners';

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
    }

    const data = await response.json();

    const tableBody = document.getElementById('bannerTableBody');

      data.banners.forEach(banner => {
        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = banner.id;
        row.appendChild(idCell);

        const bannerImgCell = document.createElement('td');
        bannerImgCell.textContent = banner.banner_url;
        row.appendChild(bannerImgCell);

        const bannerTxtCell = document.createElement('td');
        bannerTxtCell.textContent = banner.banner_txt;
        row.appendChild(bannerTxtCell);

        const titleCell = document.createElement('td');
        titleCell.textContent = banner.title;
        row.appendChild(titleCell);

        tableBody.appendChild(row);
        });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

//Fetching order table 

const apiUrl = 'https://thrivein-api-v1-ihovaneucq-et.a.run.app/order';

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
        }

        const data = await response.json();
        const tableBody = document.getElementById('orderTableBody');

        data.order_data.forEach(order => {
            const row = document.createElement('tr');

            const orderIDCell = document.createElement('td');
            orderIDCell.textContent = order.order_id;
            row.appendChild(orderIDCell);

            const userIDCell = document.createElement('td');
            userIDCell.textContent = order.name;
            row.appendChild(userIDCell);

            const namaOrderCell = document.createElement('td');
            namaOrderCell.textContent = order.title;
            row.appendChild(namaOrderCell);

            const waktuCell = document.createElement('td');
            waktuCell.textContent = order.transaction_date;
            row.appendChild(waktuCell);

            const statusCell = document.createElement('td');
            statusCell.textContent = order.status;
            row.appendChild(statusCell);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

//Order Manager
   async function cariOrderData() {
        const orderId = document.getElementById('id').value;

        try {
            const apiUrl = `https://thrivein-api-v1-ihovaneucq-et.a.run.app/order/${orderId}`;

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
            }

            const data = await response.json();

            // Set nilai masing-masing input berdasarkan hasil pencarian
            document.getElementById('namaUser').value = data.name || '';
            document.getElementById('namaOrder').value = data.title || '';
            document.getElementById('waktu').value = data.transaction_date || '';
            document.getElementById('status').value = data.status || '';

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
      async function editOrderData() {
        const orderId = document.getElementById('id').value;
        const status = document.getElementById('status').value;

        const apiUrl = `https://thrivein-api-v1-ihovaneucq-et.a.run.app/order-progress/${orderId}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: status
                })
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
            }

            console.log('Order data updated successfully!');
        } catch (error) {
            console.error('Error updating data:', error);
        }
    }




//Edit banner content 
async function updateBannerData() {
    const id = document.getElementById('id').value;
    const bannerUrl = document.getElementById('bannerUrl').value;
    const bannerText = document.getElementById('bannerText').value;
    const title = document.getElementById('title').value;

    try {
        const apiUrl = `https://thrivein-api-v1-ihovaneucq-et.a.run.app/banners/${id}`;

        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                banner_txt: bannerText,
                banner_url: bannerUrl,
                title: title,
            }),
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
        }

        console.log('Banner data updated successfully!');
    } catch (error) {
        console.error('Error updating data:', error);
    }
}
