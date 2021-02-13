const crypto = require('crypto');


module.exports = {
    
    encryptData: function(text, password) {
        var passhash = crypto.createHash('sha256').update(password).digest('hex')
        var passhash2 = passhash.substring(0, (passhash.length / 2));
        var iv = crypto.randomBytes(parseInt(process.env.ENCRIPTION_IV_LENGTH));
        var cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(passhash2), iv);
        var encrypted = cipher.update( global.CONFIGFILE_DATA.Key_Eencription + "-" + text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    },

    decryptData: function(text, password) {
        var passhash = crypto.createHash('sha256').update(password).digest('hex')
        var passhash2 = passhash.substring(0, (passhash.length / 2));
        var textParts = text.split(':');
        var iv = new Buffer(textParts.shift(), 'hex');
        var encryptedText = new Buffer(textParts.join(':'), 'hex');
        var decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(passhash2), iv);
        var decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString().split('-')[1];
    }
    
}
