const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const Papa = require('papaparse');

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS professors (
        id TEXT PRIMARY KEY,
        name TEXT,
        institution TEXT,
        department TEXT,
        departmentId TEXT,
        imageUrl TEXT,
        hIndex INTEGER,
        i10Index INTEGER,
        publications INTEGER,
        citations INTEGER,
        bio TEXT,
        researchInterests TEXT,
        domain TEXT,
        iitornit TEXT
    )`, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Professors table created or already exists.');
    });

    const csvFilePath = './professors_data.csv';
    const csvFile = fs.readFileSync(csvFilePath, 'utf8');

    Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            const stmt = db.prepare(`INSERT OR REPLACE INTO professors (id, name, institution, department, departmentId, imageUrl, hIndex, i10Index, publications, citations, bio, researchInterests, domain, iitornit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
            db.run("BEGIN TRANSACTION");
            results.data.forEach(row => {
                if (!row.name) return; // Skip rows without a name
                const nameSlug = row.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                const institutionSlug = row.institution ? row.institution.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 5) : '';
                const uniqueId = `${nameSlug}_${institutionSlug}` || `scholar_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

                stmt.run(
                    uniqueId,
                    row.name,
                    row.institution,
                    row.department,
                    row.departmentId,
                    row.imageUrl,
                    parseInt(row.hIndex) || 0,
                    parseInt(row.i10Index) || 0,
                    parseInt(row.publications) || 0,
                    parseInt(row.citations) || 0,
                    row.bio,
                    row.researchInterests,
                    row.domain,
                    row.iitornit
                );
            });
            stmt.finalize();
            db.run("COMMIT");
            console.log('Data inserted into professors table.');
        }
    });
});

db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Close the database connection.');
});
