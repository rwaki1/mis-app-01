const fs = require('fs');
const mysql = require('mysql2/promise');
const csv = require('csv-parser');

const csvFilePath = 'C:/Users/LENOVO/military-mis/backend/csv_files/personnel.csv';

(async () => {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Canada@2026!',
    database: 'military_mis',
  });

  console.log('✅ Connected to MySQL database.');

  // Lookup table config
  const lookupConfig = {
    grades: 'grade_name',
    roles: 'role_name',
    regions: 'region_name',
    brigades: 'brigade_name',
    battalions: 'battalion_name',
  };

  async function createLookupMap(table, column) {
    const [rows] = await db.execute(`SELECT id, ${column} AS name FROM ${table}`);
    const map = {};
    rows.forEach((row) => {
      map[row.name.trim()] = row.id;
    });
    return map;
  }

  async function getReferenceId(map, tableName, value) {
    const trimmed = value?.trim();
    if (!trimmed) return null;
    if (map[trimmed]) return map[trimmed];
    throw new Error(`❌ Value '${value}' not found in '${tableName}' table`);
  }

  // Load lookup maps
  const gradeMap = await createLookupMap('grades', lookupConfig.grades);
  const roleMap = await createLookupMap('roles', lookupConfig.roles);
  const regionMap = await createLookupMap('regions', lookupConfig.regions);
  const brigadeMap = await createLookupMap('brigades', lookupConfig.brigades);
  const battalionMap = await createLookupMap('battalions', lookupConfig.battalions);

  const rows = [];
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => rows.push(row))
    .on('end', async () => {
      console.log(`📄 CSV read complete. Rows found: ${rows.length}`);

      let insertedCount = 0;
      let duplicateCount = 0;
      const duplicateArmyNumbers = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const {
          name,
          grade,
          status,
          army_number,
          date_of_birth,
          photo,
          role,
          region,
          brigade,
          battalion,
          weapon_serial_number,
          radio_serial_number,
        } = row;

        try {
          const trimmedArmyNumber = army_number?.trim();
          if (!trimmedArmyNumber) {
            console.warn(`⚠️ Row ${i + 1} skipped: Missing army_number.`);
            continue;
          }

          // Check for duplicate
          const [existing] = await db.execute(
            'SELECT 1 FROM personnel WHERE army_number = ?',
            [trimmedArmyNumber]
          );
          if (existing.length > 0) {
            duplicateCount++;
            duplicateArmyNumbers.push(trimmedArmyNumber);
            continue;
          }

          // Convert reference values to IDs
          const grade_id = await getReferenceId(gradeMap, 'grades', grade);
          const role_id = await getReferenceId(roleMap, 'roles', role);
          const region_id = await getReferenceId(regionMap, 'regions', region);
          const brigade_id = await getReferenceId(brigadeMap, 'brigades', brigade);
          const battalion_id = await getReferenceId(battalionMap, 'battalions', battalion);

          // Insert personnel
          await db.execute(
            `INSERT INTO personnel (name, grade_id, status, army_number, date_of_birth, photo)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              name?.trim(),
              grade_id,
              status?.trim(),
              trimmedArmyNumber,
              date_of_birth || '1970-01-01',
              photo?.trim() || null,
            ]
          );

          // Insert assignment
          await db.execute(
            `INSERT INTO military_assignments
              (army_number, role_id, region_id, brigade_id, battalion_id, weapon_serial_number, radio_serial_number)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              trimmedArmyNumber,
              role_id,
              region_id,
              brigade_id,
              battalion_id,
              weapon_serial_number?.trim() || null,
              radio_serial_number?.trim() || null,
            ]
          );

          insertedCount++;
          console.log(`✅ Row ${i + 1} inserted: ${name}`);
        } catch (err) {
          console.error(`❌ Row ${i + 1} failed: ${err.message}`);
        }
      }

      await db.end();

      console.log('\n===== ✅ Upload Summary =====');
      console.log(`Total rows processed: ${rows.length}`);
      console.log(`✔️ Successfully inserted: ${insertedCount}`);
      console.log(`⚠️ Skipped duplicates: ${duplicateCount}`);
      if (duplicateArmyNumbers.length > 0) {
        console.log(`Duplicate army_numbers: ${duplicateArmyNumbers.join(', ')}`);
      }
      console.log('🔚 DB connection closed.');
    })
    .on('error', (err) => {
      console.error('❌ Error reading CSV:', err.message);
    });
})();
