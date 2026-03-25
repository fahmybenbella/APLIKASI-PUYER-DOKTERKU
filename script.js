// Database Obat Lengkap v10.0
const dbObat = [
    // --- OAT (OBAT ANTI TUBERKULOSIS) - BARU ---
    { cat: "OAT", nama: "Rifampicin", sediaan: 450, dosisKg: 15 }, // Rentang 10-20mg/kg
    { cat: "OAT", nama: "Rifampicin", sediaan: 600, dosisKg: 15 },
    { cat: "OAT", nama: "Isoniazid (INH)", sediaan: 100, dosisKg: 10 }, // Rentang 7-15mg/kg
    { cat: "OAT", nama: "Isoniazid (INH)", sediaan: 300, dosisKg: 10 },
    { cat: "OAT", nama: "Pyrazinamide", sediaan: 500, dosisKg: 35 }, // Rentang 30-40mg/kg
    { cat: "OAT", nama: "Ethambutol", sediaan: 250, dosisKg: 20 }, // Rentang 15-25mg/kg
    { cat: "OAT", nama: "Ethambutol", sediaan: 500, dosisKg: 20 },

    // --- ANTIBIOTIK & ANTI-INFEKSI ---
    { cat: "Antibiotik", nama: "Metronidazole", sediaan: 500, dosisKg: 7.5 },
    { cat: "Antibiotik", nama: "Cotrimoxazole (S/T)", sediaan: 480, dosisKg: 4 },
    { cat: "Antibiotik", nama: "Amoxicillin", sediaan: 500, dosisKg: 15 },
    { cat: "Antibiotik", nama: "Cefixime", sediaan: 100, dosisKg: 2.25 },
    { cat: "Antibiotik", nama: "Azithromycin", sediaan: 500, dosisKg: 10 },

    // --- ANTIVIRAL & IMUNOMODULATOR ---
    { cat: "Antivirus", nama: "Methisoprinol", sediaan: 500, dosisKg: 12.5 },
    { cat: "Antivirus", nama: "Acyclovir", sediaan: 200, dosisKg: 20 },

    // --- BATUK, PILEK & ASMA ---
    { cat: "Flu/Alergi", nama: "CTM", sediaan: 4, dosisKg: 0.1 },
    { cat: "Flu/Alergi", nama: "Cetirizine", sediaan: 10, dosisKg: 0.25 },
    { cat: "Flu/Pilek", nama: "Pseudoephedrine", sediaan: 30, dosisKg: 1 },
    { cat: "Batuk", nama: "Ambroxol", sediaan: 30, dosisKg: 0.5 },
    { cat: "Batuk", nama: "GG", sediaan: 100, dosisKg: 5 },
    { cat: "Sesak", nama: "Salbutamol", sediaan: 2, dosisKg: 0.05 },

    // --- DEMAM & RADANG ---
    { cat: "Demam", nama: "Paracetamol", sediaan: 500, dosisKg: 10 },
    { cat: "Demam", nama: "Ibuprofen", sediaan: 200, dosisKg: 5 },
    { cat: "Radang", nama: "Dexamethasone", sediaan: 0.5, dosisKg: 0.015 },
    { cat: "Radang", nama: "Methylprednisolone", sediaan: 4, dosisKg: 0.125 },

    // --- VITAMIN & ANTI-MUAL ---
    { cat: "Vitamin", nama: "Vitamin C", sediaan: 50, dosisKg: 2.5 },
    { cat: "Mual/Muntah", nama: "Ondansetron", sediaan: 4, dosisKg: 0.15 },
    { cat: "Mual/Muntah", nama: "Domperidone", sediaan: 10, dosisKg: 0.25 },

    { cat: "Lainnya", nama: "Custom / Manual", sediaan: 0, dosisKg: 0 }
];

// --- LOGIKA PROGRAM ---

function addDrugRow() {
    const container = document.getElementById('drugList');
    const id = Date.now();
    const div = document.createElement('div');
    div.className = 'drug-row';
    div.id = `row-${id}`;

    let options = dbObat.map((o, i) => `<option value="${i}">${o.cat}: ${o.nama} (${o.sediaan}mg)</option>`).join('');

    div.innerHTML = `
        <button class="btn-remove" onclick="document.getElementById('row-${id}').remove()">×</button>
        <div class="drug-grid">
            <div>
                <label>Pilih Obat</label>
                <select class="sel-obat" onchange="isiOtomatis(${id}, this.value)">
                    <option value="">-- Pilih --</option>
                    ${options}
                </select>
            </div>
            <div>
                <label>mg/kgBB</label>
                <input type="number" id="dos-${id}" step="0.01" placeholder="0">
            </div>
            <div>
                <label>Sediaan (mg)</label>
                <input type="number" id="stok-${id}" placeholder="0">
            </div>
        </div>
    `;
    container.appendChild(div);
}

function isiOtomatis(id, index) {
    if (index === "") return;
    const data = dbObat[index];
    document.getElementById(`dos-${id}`).value = data.dosisKg;
    document.getElementById(`stok-${id}`).value = data.sediaan;
}

function hitungSemua() {
    const bb = parseFloat(document.getElementById('bb').value);
    const bks = parseInt(document.getElementById('jmlBungkus').value);
    const namaPasien = document.getElementById('namaPasien').value || "PASIEN";
    const rows = document.querySelectorAll('.drug-row');

    if (!bb || !bks || rows.length === 0) {
        alert("Lengkapi data Berat Badan, Jumlah Bungkus, dan Obat!");
        return;
    }

    let hasilHtml = "";
    rows.forEach(row => {
        const id = row.id.split('-')[1];
        const sel = row.querySelector('.sel-obat');
        if (sel.selectedIndex === 0) return;

        const textObat = sel.options[sel.selectedIndex].text;
        const namaObat = textObat.split(': ')[1].split(' (')[0];
        
        const dos = parseFloat(document.getElementById(`dos-${id}`).value);
        const stok = parseFloat(document.getElementById(`stok-${id}`).value);

        if (dos && stok) {
            const perBks = bb * dos;
            const totalTab = (perBks * bks) / stok;
            hasilHtml += `<tr>
                <td><b>${namaObat}</b></td>
                <td style="color:#666;">${perBks.toFixed(2)} mg</td>
                <td style="font-weight:bold; color:#007AFF; text-align:right;">${totalTab.toFixed(2)} Tab</td>
            </tr>`;
        }
    });

    document.getElementById('resHeader').innerText = `👤 ${namaPasien.toUpperCase()} | ⚖️ ${bb}kg | 📦 ${bks} Bks`;
    document.getElementById('resBody').innerHTML = hasilHtml;
    document.getElementById('resultCard').style.display = 'block';
    document.getElementById('resultCard').scrollIntoView({ behavior: 'smooth' });
}

window.onload = addDrugRow;
