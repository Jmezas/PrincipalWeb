export function createFormData(obj: object) {
    const formData = [];
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
        if (typeof obj[prop] === 'object' && Array.isArray(obj[prop])) {
            formData.push(`${ prop }=${ encodeURIComponent(JSON.stringify(obj[prop]))}`);
        } else {
            formData.push(`${ prop }=${ encodeURIComponent(obj[prop])}`);
        }
        }
    }
    return formData.join('&');
}

export function errorHandler(content) {
    console.log(content);
    const dictionary = [
        // Unhandled
        { code: 'A000', persist: true,
        message: 'The request could not be processed.\nSend the following content to technical support:\n\n' + encodeResp(content) },
        { code: 'A004', message: 'Esta entrada ya existe' },
        { code: 'A005', message: 'No se pudo enviar correo' },
        // Auth
        { code: '0001', message: 'Contraseña o correo electrónico no válido' },
        { code: '0002', message: 'Cuenta no activada' },
        { code: '0003', message: 'La usuario ya está verificada' },
        { code: '0004', message: 'Invalid token' },
        { code: '0005', message: 'Code Expired' },
        { code: '0006', message: 'Expired token, log in again' },
        { code: '0007', message: 'Insufficient permissions' },
        { code: '0008', message: 'Maximum number of codes exceeded' },
        // User
        { code: '1001', message: 'User not found' },
        { code: '1002', message: 'This user already exist' },
        // Classification
        { code: '3001', message: 'User not found' },
        { code: '3002', message: 'This user already exist' },
        // Genres
        { code: '5001', message: 'Genre not found' },
        { code: '5002', message: 'This genre already exist' },
        // Languages
        { code: '6001', message: 'Language not found' },
        { code: '6002', message: 'This language already exist' },
        // Person
        { code: '9001', message: 'Person not found' },
        { code: '9002', message: 'This person already exist' },
        // Files
        { code: '7001', message: 'File not found' },
        { code: '7002', message: 'Can\'t ipload' },
        { code: '7003', message: 'There is a file with this name, rename the file you are trying to upload and try again' },
        { code: '7004', message: 'Can\'t upload master list' },
        // Multimedia
        { code: '8001', message: 'Multimedia not found' },
        { code: '8002', message: 'The current language already exist in sources' },
        { code: '8003', message: 'You cannot set the master file once processed. Please contact support to make this change' },
        { code: '8004', message: 'Trailer not found' },
        { code: '8005', message: 'Master file not found' },
        { code: '8006', message: 'Cover image must be 1200x800' },
        { code: '8007', message: 'Cover Image must be 800x1200' },
        { code: '8008', message: 'Source not found' },
        // Subscriptions
        { code: 'S001', message: 'Invalid payment method' },
        { code: 'S002', message: 'Customer not found' },
        { code: 'S003', message: 'Subscription expired' },
        { code: 'S004', message: 'Subscription not found' },
    ];

    let resp = dictionary[0];
    if (content.hasOwnProperty('error') && content.error.hasOwnProperty('error')) {
      const pos = dictionary.map(entry => entry.code).indexOf(content.error.error);
      if (pos !== -1) { resp = dictionary[pos]; } else {
        if (content.status === 400) {
            resp.message = 'One or more of the fields are incorrect';
        }
      }
    }

    if (content.status === 413) {
        resp.message = 'File too big';
    }

    if (content.status === 0) {
        resp.message = 'Could not connect to server';
        resp.persist = true;
    }

    if (content.status === 500) {
        resp.message = dictionary[0].message;
    }

    return resp;
}

function encodeResp(Obj) {
    return btoa(JSON.stringify(Obj));
}

