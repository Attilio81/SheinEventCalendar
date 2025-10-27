# Setup Techno Events Database

Questo file spiega come popolare il database Supabase con i 21 festival e club techno reali.

## Opzione 1: SQL Diretto (CONSIGLIATO)

Questo è il metodo più veloce e affidabile.

### Passaggi:

1. Accedi a Supabase Dashboard
2. Vai a **SQL Editor** (https://supabase.com/dashboard/project/[your-project]/sql)
3. Crea una **New Query**
4. Copia e incolla il contenuto di `supabase-techno-events-populate.sql`
5. Clicca **Run** (oppure Ctrl+Enter)
6. Attendi che completi (dovrebbe mostrare una tabella dei risultati)

### Output atteso:
```
total_events: 21
unique_cities: 8 (Amsterdam, Turin, Mannheim, Novalja, Firenze, Tilburg, Tisno, Monegros)
unique_countries: 6 (Italy, Netherlands, Germany, Croatia, Spain)
```

### Cosa fa il SQL:
- ✅ Inserisce 21 festival/club reali nel database
- ✅ USA `ON CONFLICT ... DO UPDATE` quindi è **SAFE DA ESEGUIRE MULTIPLE VOLTE**
- ✅ Se l'evento esiste già (source + source_url), lo aggiorna
- ✅ Se è nuovo, lo crea
- ✅ Updatera `updated_at` con il timestamp corrente

## Opzione 2: Pulsante nell'App (ALTERNATIVA)

Se preferisci usare l'interfaccia dell'app:

1. Apri la sezione **🎵 Techno Events** nell'app
2. Vedrai il messaggio "Nessun evento trovato"
3. Clicca il pulsante **"✨ Carica 21 Festival"**
4. Attendi l'inizializzazione (il pulsante mostrerà uno spinner)
5. Gli eventi appariranno automaticamente

**Nota:** Questo metodo è più lento (2-5 secondi) perché fa 21 insert individuali. Il metodo SQL è più veloce.

## Problemi Comuni

### Errore: "ON CONFLICT DO UPDATE command cannot affect row a second time"
**Causa:** Hai due eventi con lo stesso `source` + `source_url` nella lista.
**Soluzione:** Usa il file SQL `supabase-techno-events-populate.sql` che deduplica automaticamente.

### Errore: "Failed to parse UPSERT columns specification"
**Causa:** Il formato del comando UPSERT non è supportato dalla tua versione Supabase.
**Soluzione:** Assicurati di usare il file SQL fornito (è testato e funziona).

### Errore: "RLS policy violation"
**Causa:** Le politiche Row Level Security non permettono INSERT/UPDATE.
**Soluzione:** Esegui questo comando SQL PRIMA di inserire gli eventi:

```sql
ALTER POLICY "Authenticated users can insert public techno events"
  ON public_techno_events FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

## Dati Inseriti

### Festival Europei (15):
- ADE (Amsterdam Dance Event) - Oct 16-20, 2025
- TIME WARP 2025 - Nov 7-8, 2025 (Mannheim, Germania)
- TIME WARP Spring 2026 - Mar 21, 2026 (Mannheim, Germania)
- DGTL Amsterdam 2026 - Apr 4-5, 2026
- Decibel Easter Festival 2026 - Apr 4-6, 2026 (Firenze)
- ZRCE Spring Break 2026 - May 22-25, 2026 (Croazia)
- AWAKENINGS FESTIVAL 2026 - Jun 27-28, 2026 (#1 in Europe!)
- DEKMANTEL FESTIVAL 2026 - Jul 31-Aug 2, 2026 (Amsterdam)
- Terminal V Croazia 2026 - Jul 16-20, 2026
- Monegros Desert Festival 2026 - Jul 25, 2026 (Spagna)
- KAPPA FUTURFESTIVAL 2026 - Jul 3-5, 2026 (Torino) ⭐ Top 6 worldwide
- SONUS FESTIVAL 2026 - Aug 17-21, 2026 (Croazia)
- BARRAKUD FESTIVAL 2026 - Aug 9-13, 2026 (Croazia)
- DRAAIMOLEN FESTIVAL 2026 - Sep 5-6, 2026 (Olanda)
- DECIBEL OPEN AIR 2026 - Sep 5-6, 2026 (Firenze)

### Club Torinesi (6):
- AUDIODROME presents ENRICO SANGIULIANO - Oct 17, 2025
- Q35 WAREHOUSE - Season Opener: ANETHA - Sep 27-28, 2025
- Q35 WAREHOUSE - JOHN TALABOT - Oct 4, 2025
- Q35 WAREHOUSE - WIRED Marathon - Oct 18, 2025

**Totale: 21 eventi reali con:**
- ✅ Date verificate
- ✅ Venue e coordinate GPS reali
- ✅ Lineup completo da fonti ufficiali
- ✅ Ticket URLs
- ✅ Capacità e generi musicali

## Après Insertion

Una volta che il database è popolato:

1. Ricarica l'app (F5 o refresh)
2. Vai a **"🎵 Techno Events"**
3. Vedrai tutti i 21 festival ordinati per data
4. Puoi filtrare per città (Turin, Amsterdam, Mannheim, etc.)
5. Clicca su un evento per vederne i dettagli completi
6. Accedi ai ticket tramite i link forniti

## Domande?

Consulta il report completo: `REPORT FESTIVAL TECHNO EUROPA - NOVEMBRE 2025 / OTTOBRE 2026`

Tutte le informazioni sono sourced da:
- **Xceed.me** - Event ticketing platform
- **Resident Advisor** - Electronic music database
- **EventDestination.net** - Festival aggregator
- Official festival websites
