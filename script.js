// INI UNTUK INDEX

// Isi dengan token jwt
const token = '';

// Fungsi ini berguna untuk inputan automatis Uppercase
function toUpperCase(input) {
        input.value = input.value.toUpperCase();
}
// Fungsi Membuka side section 
document.addEventListener('alpine:init', () => {
        Alpine.data('layout', () => ({
          profileOpen: false,
          asideOpen: true,
        }));
      });

// Ini untuk fatch data banyak order per status (tampilkan di card paling atas)
const apiUrlOrderCount = 'https://thrivein-api-v1-0-0-sxbz2gldiq-et.a.run.app/order-count';
document.addEventListener('DOMContentLoaded', async function () {
    try {
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

// Ini untuk Fatch data banyaknya user (tampilkan di card paling atas)
const apiUrlUserCount = 'https://thrivein-api-v1-0-0-sxbz2gldiq-et.a.run.app/user-count';
document.addEventListener('DOMContentLoaded', async function () {
    try {
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

        const totalUserElement = document.getElementById('totalUser');
        totalUserElement.textContent = userCountData.user;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
});


//Fetching data order (tampilkan di tabel order)
const apiUrlOrder = 'https://thrivein-api-v1-0-0-sxbz2gldiq-et.a.run.app/order';
        //token
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
        //rander table order
        const renderTableOrder = (orders) => {
            const tableBody = document.getElementById('orderTableBody');
            tableBody.innerHTML = '';

            orders.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-4 py-2">${order.order_id}</td>
                    <td class="px-4 py-2">${order.name}</td>
                    <td class="px-4 py-2">${order.title}</td>
                    <td class="px-4 py-2">${new Date(order.transaction_date).toLocaleString()}</td>
                    <td class="px-4 py-2">${order.status}</td>
                `;
                tableBody.appendChild(row);
            });
        };
        //rander dan tampilkan pagination
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

//Order Manager Page
async function cariOrderData() {
        const orderId = document.getElementById('id').value;

        try {
            const apiUrl = `https://thrivein-api-v1-0-0-sxbz2gldiq-et.a.run.app/order/${orderId}`;

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

        const apiUrl = `https://thrivein-api-v1-0-0-sxbz2gldiq-et.a.run.app/order-progress/${orderId}`;

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

//Fatching Data banner (tampilkan di tabel banners)
document.addEventListener('DOMContentLoaded', async function () {
  const apiUrl = 'https://thrivein-api-v1-0-0-sxbz2gldiq-et.a.run.app/banners';
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

//Banner Manager content Page
async function updateBannerData() {
    const id_banners = document.getElementById('id_banners').value;
    const bannerUrl = document.getElementById('bannerUrl_banners').value;
    const bannerText = document.getElementById('bannerText_banners').value;
    const title = document.getElementById('title_banners').value;

    try {
        const apiUrl = `https://thrivein-api-v1-0-0-sxbz2gldiq-et.a.run.app/banners/${id_banners}`;

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

//fetching data Articles (tampilkan di tabel articles)
document.addEventListener('DOMContentLoaded', async function () {
    const apiUrl = 'https://thrivein-api-v1-0-0-sxbz2gldiq-et.a.run.app/articles';
    const pageSize = 10;

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

         const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

        articles.forEach(article => {
            const row = document.createElement('tr');
            const idCell = document.createElement('td');
            idCell.textContent = article.article_id;
            row.appendChild(idCell);

            const titleCell = document.createElement('td');
            titleCell.textContent = article.title;
            row.appendChild(titleCell);

           const contentCell = document.createElement('td');
        // Truncate content to a certain length (e.g., 100 characters)
        contentCell.textContent = truncateText(article.content, 100);
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

//Articles Manageger Content post Page
const postArticle = async () => {
  const apiUrl = 'https://thrivein-api-v1-0-0-sxbz2gldiq-et.a.run.app/post-article';
  const bannerUrl = document.getElementById('bannerUrlArticle').value;
  const content = document.getElementById('bannerTextArticle').value;
  const title = document.getElementById('titleArticle').value;

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


//Fatching data services (tampilkan di tabel services)
document.addEventListener('DOMContentLoaded', async function () {
        const apiUrl = 'https://thrivein-api-v1-0-0-sxbz2gldiq-et.a.run.app/getservice/all';

        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
            }

            const data = await response.json();
            const services = data['list-services'];

            renderServicesTable(services);
        } catch (error) {
            console.error('Error fetching services data:', error);
        }
    });


const renderServicesTable = (services) => {
    const tableBody = document.getElementById('servicesTableBody');

    services.forEach(service => {
        const row = document.createElement('tr');

        const serviceIdCell = document.createElement('td');
        serviceIdCell.textContent = service.service_id;
        row.appendChild(serviceIdCell);

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

        tableBody.appendChild(row);
    });
};
// Service Manager Page
const serviceId = document.getElementById('serviceId').value;

const apiUrl = `https://thrivein-api-v1-0-0-sxbz2gldiq-et.a.run.app/getservice/`;

const fetchServiceDetails = async (serviceId) => {
    const url = apiUrl + serviceId;
    try {
      const response = await fetch(url, {
        method: 'GET',
         headers: {
                    'Authorization': `Bearer ${token}`
                },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching service details:', error);
      return null;
    }
};

const fillInputFields = (serviceDetails) => {
  const iconUrlInput = document.getElementById('iconUrl_services');
  const descriptionInput = document.getElementById('description_services');


  if (serviceDetails) {
    iconUrlInput.value = serviceDetails.icon_url || '';
    descriptionInput.value = serviceDetails.description || '';

  } else {
    console.log('Service details not found.');
    // Clear input fields if service details are not found
    iconUrlInput.value = '';
    descriptionInput.value = '';

  }
};

const searchService = async () => {
  const serviceId = document.getElementById('serviceId').value;
  
  try {
    const serviceDetails = await fetchServiceDetails(serviceId);
    fillInputFields(serviceDetails);
  } catch (error) {
    console.error('Error fetching service details:', error);
    // You might want to display an error message to the user
  }
};


const editService = async () => {
  const serviceId = document.getElementById('serviceId').value;

  const url = `https://thrivein-api-v1-0-0-sxbz2gldiq-et.a.run.app/service/${serviceId}`;

  const newData = {
    icon_url: document.getElementById('iconUrl_services').value,
    description: document.getElementById('description_services').value,
    title: document.getElementById('title_services').value,

  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newData),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
    }

    console.log('Service updated successfully');
  } catch (error) {
    console.error('Error updating service:', error);
  }
};


