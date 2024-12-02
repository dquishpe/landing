const databaseURL = "https://landing-d3977-default-rtdb.firebaseio.com/misdatos.json"; 

let ready = () => {
    console.log('DOM está listo');
    getData();
}

let loaded = (eventLoaded) => {
    let surveyForm = document.getElementById('surveyForm');

    surveyForm.addEventListener('submit', (eventSubmit) => {
        eventSubmit.preventDefault();

        const name = document.getElementById('nameInput').value;
        const email = document.getElementById('emailInput').value;
        const genre = document.getElementById('genreSelect').value;

        if (name.length === 0 || email.length === 0) {
            alert('Por favor, llena todos los campos');
            return;
        }

        // Guarda los datos en la base de datos
        sendData({ name, email, genre });
    });
}

const sendData = (data) => {
    data['saved'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' });

    fetch(databaseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();
    })
    .then(result => {
        alert('Gracias por tu voto');
        document.getElementById('surveyForm').reset();
        getData();
    })
    .catch(error => {
        alert('Hubo un error al registrar tu voto.');
    });
}

const getData = async () => {
    try {
        const response = await fetch(databaseURL, { method: 'GET' });

        if (!response.ok) {
            alert('Error al obtener los datos');
            return;
        }

        const data = await response.json();

        if (data != null) {
            // Contamos los votos por género
            let genreVotes = {
                fiction: 0,
                autoayuda: 0,
                misterio: 0,
                fantasia: 0,
                romance: 0
            };

            for (let key in data) {
                let { genre } = data[key];
                if (genreVotes[genre] !== undefined) {
                    genreVotes[genre]++;
                }
            }

            // // Mostramos los resultados en la sección de resultados
            // let resultsHTML = '';
            // for (let genre in genreVotes) {
            //     resultsHTML += `
            //         <p><strong>${genre.charAt(0).toUpperCase() + genre.slice(1)}</strong>: ${genreVotes[genre]} votos</p>
            //     `;
            // }

            // document.getElementById('resultsSection').innerHTML = resultsHTML;
             // Generamos la tabla de resultados
            let resultsHTML = `
            <table class="results-table">
                <thead>
                <tr>
                    <th>Género</th>
                    <th>Votos</th>
                </tr>
                </thead>
                <tbody>
            `;

            for (let genre in genreVotes) {
            resultsHTML += `
                <tr>
                <td>${genre.charAt(0).toUpperCase() + genre.slice(1)}</td>
                <td>${genreVotes[genre]}</td>
                </tr>
            `;
            }

            resultsHTML += `
                </tbody>
            </table>
            `;

            document.getElementById('resultsSection').innerHTML = resultsHTML;
        }

    } catch (error) {
        alert('Hubo un error al obtener los resultados.');
    }
}

window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded);
