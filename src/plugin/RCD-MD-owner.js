const ownerContact = async (m, gss) => {
    // Define the owner contacts as an array of objects with names and numbers
    const ownerContacts = [
        { name: 'Owner One', number: '1234567890' },  // First owner
        { name: 'Owner Two', number: '0987654321' },  // Second owner
        { name: 'Owner Three', number: '1122334455' } // Third owner
    ];

    const prefixMatch = m.body.match(/^[\\/!#.]/); // Match command prefix
    const prefix = prefixMatch ? prefixMatch[0] : '/'; // Default prefix
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (cmd === 'owner') {
        try {
            // Create an array of formatted vCard contact strings
            const contactsToSend = ownerContacts.map(contact => ({
                vcard: `BEGIN:VCARD
VERSION:3.0
FN:${contact.name}
TEL;TYPE=CELL:${contact.number}
END:VCARD`
            }));

            // Send multiple vCards as contacts
            await gss.sendMessage(m.from, { contacts: { displayName: 'Owner Contacts', contacts: contactsToSend } }, { quoted: m });
            await m.react("✅"); // React with success emoji

            console.log("Contacts sent successfully.");
        } catch (error) {
            console.error('Error sending owner contacts:', error);
            await m.reply('Error sending owner contacts.');
            await m.react("❌"); // React with error emoji
        }
    }
};

export default ownerContact;
