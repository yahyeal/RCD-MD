const ownerContact = async (m, gss) => {
    // Define the owner contacts as an array of objects with names and numbers
    const ownerContacts = [
        { name: 'Owner One', number: '1234567890' }, // First owner
        { name: 'Owner Two', number: '0987654321' }, // Second owner
        { name: 'Owner Three', number: '1122334455' } // Third owner
    ];

    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (cmd === 'owner') {
        try {
            // Create an array of formatted contact strings
            const contactsToSend = ownerContacts.map(contact => ({
                vCard: `BEGIN:VCARD
VERSION:3.0
FN:${contact.name}
TEL;TYPE=CELL:${contact.number}
END:VCARD`
            }));

            // Send multiple contacts
            await gss.sendContact(m.from, contactsToSend, m);
            await m.React("✅");
        } catch (error) {
            console.error('Error sending owner contacts:', error);
            m.reply('Error sending owner contacts.');
            await m.React("❌");
        }
    }
};

export default ownerContact;
