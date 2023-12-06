const token = '';

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
  const apiUrlOrder = 'https://thrivein-api-v1-ihovaneucq-et.a.run.app/order';

        const fetchDataOrder = async (page, size) => {
            const response = await fetch(`${apiUrlOrder}?page=${page}&size=${size}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
            }

            const data = await response.json();
            return data.order_data;
        };

        const renderTableOrder = (orders) => {
            const tableBody = document.getElementById('orderTableBody');
            tableBody.innerHTML = '';

            orders.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.order_id}</td>
                    <td>${order.name}</td>
                    <td>${order.title}</td>
                    <td>${new Date(order.transaction_date).toLocaleString()}</td>
                    <td>${order.status}</td>
                `;
                tableBody.appendChild(row);
            });
        };

        const renderPaginationOrder = (currentPage, totalPages) => {
            const paginationContainer = document.getElementById('paginationContainerOrder');
            paginationContainer.innerHTML = '';

            for (let i = 1; i <= totalPages; i++) {
                const pageLink = document.createElement('a');
                pageLink.href = '#';
                pageLink.textContent = i;
                pageLink.classList.add('px-4', 'py-2', 'text-blue-500', 'cursor-pointer');

                pageLink.addEventListener('click', async () => {
                    const orders = await fetchDataOrder(i, 10); // Ganti 10 dengan ukuran halaman yang sesuai
                    renderTable(orders);
                });

                if (i === currentPage) {
                    pageLink.classList.add('bg-blue-500', 'text-white');
                }

                paginationContainer.appendChild(pageLink);
            }
        };

        const initOrder = async () => {
            const currentPage = 1;
            const pageSize = 10; // Ganti dengan ukuran halaman yang sesuai
            const orders = await fetchDataOrder(currentPage, pageSize);
            renderTableOrder(orders);

            // Dummy total pages, you should replace this with the actual total pages from your API response
            const totalPages = 5;
            renderPaginationOrder(currentPage, totalPages);
        };

        initOrder();

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

//fetching Api Articles
document.addEventListener('DOMContentLoaded', async function () {
    const apiUrl = 'https://thrivein-api-v1-ihovaneucq-et.a.run.app/articles';
    const pageSize = 10; // Set the page size according to your requirement

    const fetchDataArticle = async (page, size) => {
         const response = await fetch(`${apiUrl}?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
    }

    const data = await response.json();
    return data.articles;
};
    const renderTableArticle = (articles) => {
        const tableBody = document.getElementById('articleTableBody');
        tableBody.innerHTML = ''; // Clear existing content

        articles.forEach(article => {
            const row = document.createElement('tr');
            const idCell = document.createElement('td');
            idCell.textContent = article.article_id;
            row.appendChild(idCell);

            const titleCell = document.createElement('td');
            titleCell.textContent = article.title;
            row.appendChild(titleCell);

            const contentCell = document.createElement('td');
            contentCell.textContent = article.content;
            row.appendChild(contentCell);

            const bannerUrlCell = document.createElement('td');
            bannerUrlCell.textContent = article.banner_url;
            row.appendChild(bannerUrlCell);

            const uploadedDateCell = document.createElement('td');
            uploadedDateCell.textContent = article.uploaded_date;
            row.appendChild(uploadedDateCell);

            tableBody.appendChild(row);
        });
    };

    const renderPaginationArticle = async (currentPage, totalPages) => {
        const paginationContainer = document.getElementById('paginationContainerArticles');
        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = '#';
            pageLink.textContent = i;
            pageLink.classList.add('px-4', 'py-2', 'text-blue-500', 'cursor-pointer');

            pageLink.addEventListener('click', async () => {
                const articles = await fetchDataArticle(i, pageSize);
                renderTableArticle(articles);
            });

            if (i === currentPage) {
                pageLink.classList.add('bg-blue-500', 'text-white');
            }

            paginationContainer.appendChild(pageLink);
        }
    };

    const initArticle = async () => {
        const currentPage = 1;


        const totalArticles = await fetchDataArticle(currentPage, pageSize);
        const totalPages = 5

        const articles = await fetchDataArticle(currentPage, pageSize);
        renderTableArticle(articles);

        renderPaginationArticle(currentPage, totalPages);
    };

    initArticle();
});

//post article
// Function to handle the POST request for posting an article
const postArticle = async () => {
  const apiUrl = 'https://thrivein-api-v1-ihovaneucq-et.a.run.app/post-article';
  const bannerUrl = document.getElementById('bannerUrlPost').value;
  const content = document.getElementById('bannerTextPost').value;
  const title = document.getElementById('titlePost').value;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        banner_url: bannerUrl,
        content: content,
        title: title,
      }),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
    }

    // Assuming you want to do something with the successful response, you can handle it here
    const result = await response.json();
    console.log('Article posted successfully:', result);
  } catch (error) {
    console.error('Error posting article:', error);
  }
};

// Function to fetch services data from the API
const fetchServices = async () => {
    const apiUrl = 'https://thrivein-api-v1-ihovaneucq-et.a.run.app/services';

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
        }

        const data = await response.json();
        return data.services;
    } catch (error) {
        console.error('Error fetching services data:', error);
        return [];
    }
};

// Function to render services data in the table
// Function to render services data in the table
const renderServicesTable = (services) => {
    const tableBody = document.getElementById('servicesTableBody');

    services.forEach(service => {
        const row = document.createElement('tr');
        
        const categoryCell = document.createElement('td');
        categoryCell.textContent = service.category;
        row.appendChild(categoryCell);

        const titleCell = document.createElement('td');
        titleCell.textContent = service.title;
        row.appendChild(titleCell);
        
        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = service.description;
        row.appendChild(descriptionCell);
        
        const iconUrlCell = document.createElement('td');
        iconUrlCell.textContent = service.icon_url;
        row.appendChild(iconUrlCell);

        const serviceIdCell = document.createElement('td');
        serviceIdCell.textContent = service.color;
        row.appendChild(serviceIdCell);



        tableBody.appendChild(row);
    });
};

// Initialize the page with services data
document.addEventListener('DOMContentLoaded', async function () {
    const services = await fetchServices();
    renderServicesTable(services);
});

// Function CAPSLOCK Input ID
function toUpperCase(input) {
        input.value = input.value.toUpperCase();
}