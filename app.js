// ==========================================
// APP.JS - MESIN PENGGERAK PWA VERCEL
// ==========================================

// MASUKKAN URL SAKTI DARI GOOGLE APPS SCRIPT DI SINI!
const API_URL = "https://script.google.com/macros/s/AKfycbyHDLKp0oDRhaRO7N5sCp3lPfy44cUl0JwT-gShMj5WU5wdS221HicZC-nw-UB6uCDFzA/exec";

// Fungsi untuk menembak API ke Google Apps Script
async function callAPI(action, payload = {}) {
    payload.action = action;

    // Ambil data user yang sedang login dari penyimpanan HP (Local Storage)
    const userStr = localStorage.getItem('smepi_user');
    if (userStr) {
        const userObj = JSON.parse(userStr);
        payload.loginID = userObj.loginID;
    }

    try {
        // Trik khusus GAS: Menggunakan text/plain agar tidak diblokir CORS oleh browser
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        return result;

    } catch (error) {
        console.error("API Error:", error);
        return { success: false, message: "Koneksi terputus. Pastikan internet Anda stabil." };
    }
}

// Fungsi Keamanan Global (Cek apakah user sudah login)
function checkAuth(requiredRole) {
    const userStr = localStorage.getItem('smepi_user');
    if (!userStr) {
        window.location.href = 'index.html'; // Usir ke halaman login
        return null;
    }

    const user = JSON.parse(userStr);

    // Jika rolenya tidak sesuai (misal Petani mencoba buka halaman Mandor)
    if (requiredRole && !user.role.includes(requiredRole)) {
        if (user.role === 'mandor') window.location.href = 'mandor.html';
        else window.location.href = 'petani.html';
        return null;
    }

    return user;
}

// Fungsi Logout Global
function logoutApp() {
    localStorage.removeItem('smepi_user');
    window.location.href = 'index.html';
}

// Fungsi Alert Global (Merapikan Tampilan Notifikasi)
function SMEPI_Alert(title, message, type = 'info') {
    alert(`${title.toUpperCase()}\n\n${message}`);
    // Nanti kita bisa upgrade menggunakan SweetAlert2 agar tampilannya lebih cantik!
}

function SMEPI_Confirm(title, message, btnText, type) {
    return new Promise((resolve) => {
        const isYes = confirm(`${title.toUpperCase()}\n\n${message}`);
        resolve(isYes);
    });
}