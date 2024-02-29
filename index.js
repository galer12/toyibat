const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (message) => {
    console.log(message.body);
    console.log(await (await message.getContact()).getFormattedNumber())
});

let kehadiran = {};

// Informasi Kumpul atau Pertemuan 
client.on('message', async (message) => {
    const [action, tanggal, waktu, tempat, pakaian, note] = message.body.split(';');
    const kegiatan = message.body.split(';')[1];
    const nama = [];
    console.log(message.body);
    console.log(await (await message.getContact()).getFormattedNumber());

    const args = message.body.split(';');
    const command = args.shift().trim();
	if (action.trim() =='!info') {

        const currentHour = new Date().getHours();
        
        // Menentukan salam berdasarkan waktu
        let greeting = '';
        if (currentHour < 12) {
            greeting = 'Selamat pagi';
        } else if (currentHour < 15) {
            greeting = 'Selamat siang';
        } else {
            greeting = 'Selamat sore';
        }

		await message.reply(`🔊🔊
Assalamualaikum warahmatullahi wabarakatuh,
${greeting}, Salam Pramuka! 
Diberitahukan kepada seluruh anggota Dewan Kerja Ranting Padalarang diwajibkan hadir pada:

📆 Hari/tanggal : ${tanggal}
⏰ Waktu : ${waktu}
📍 Tempat : ${tempat}
👔 Pakaian : ${pakaian}

📝 Catatan : ${note}

Demikian pengumuman ini saya sampaikan saya harap seluruh anggota dapat hadir pada kegiatan tersebut di atas, sesuai dengan waktu yang telah di tentukan, Terimakasih.

Created by ${await (await message.getContact()).getFormattedNumber()}`);
	}
    else if (action.trim() =='!warning') {
        const currentHour = new Date().getHours();
        
        // Menentukan salam berdasarkan waktu
        let greeting = '';
        if (currentHour < 12) {
            greeting = 'Selamat pagi';
        } else if (currentHour < 18) {
            greeting = 'Selamat siang';
        } else {
            greeting = 'Selamat sore';
        }

        await message.reply(`🔊🔊
Assalamualaikum warahmatullahi wabarakatuh,
${greeting}, Salam Pramuka! 
Mengingatkan kembali kepada seluruh anggota Dewan Kerja Ranting Padalarang diwajibkan hadir pada:

📆 Hari/tanggal : ${tanggal}
⏰ Waktu : ${waktu}
📍 Tempat : ${tempat}
👔 Pakaian : ${pakaian}

📝 Catatan : ${note}

Demikian pengumuman ini saya sampaikan saya harap seluruh anggota dapat hadir pada kegiatan tersebut di atas, sesuai dengan waktu yang telah di tentukan, Terimakasih.

Created by ${await (await message.getContact()).getFormattedNumber()}`);
    }
    else if (action.trim() =='!list') {
        await message.reply(`List kehadiran kegiatan ${kegiatan} :
1.
2.
3.
4.
5.
dst.

List tidak hadir - alasan :
1.
2.
3.
4.
5.
dst.

created by ${await (await message.getContact()).getFormattedNumber()}`);
    }
    else if (action.trim() === '!hadir') {
        // Menambahkan peserta ke daftar kehadiran
        let namaPeserta = {};
        // Periksa apakah pesan mengandung karakter ';'
        if (args.length > 1) {
            kegiatan = args[0].trim(); // Ambil nama kegiatan dari argumen pertama
            namaPeserta = args.slice(1).join(';').trim(); // Gabungkan sisa pesan setelah !hadir
        } else {
            // Jika pesan tidak mengandung karakter ';', maka peserta dianggap tidak memiliki nama kegiatan
            namaPeserta = args[0].trim();
        }

        if (!kehadiran[kegiatan]) {
            kehadiran[kegiatan] = []; // Inisialisasi array jika belum ada
        }
        kehadiran[kegiatan].push(namaPeserta); // Tambahkan peserta ke daftar kehadiran

        // Membuat daftar kehadiran dalam bentuk teks
        let daftarKehadiran = `List kehadiran kegiatan ${kegiatan} :\n`;
        kehadiran[kegiatan].forEach((peserta, index) => {
            daftarKehadiran += `${index + 1}. ${peserta}\n`;
        });

        // Kirim kembali daftar kehadiran yang sudah diperbarui
        await message.reply(daftarKehadiran);
    }
});

client.initialize();