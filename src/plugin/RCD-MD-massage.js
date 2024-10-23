const _0x1b7dea = _0x27bb;
(function (_0x14acb1, _0x5e6088) {
    const _0x38ea75 = _0x27bb, _0x40c0f6 = _0x14acb1();
    while (!![]) {
        try {
            const _0x5198cd = -parseInt(_0x38ea75(0x1ef)) / (0x25b + -0x24d0 + 0x2276) * (-parseInt(_0x38ea75(0x1e6)) / (-0x596 + 0x110c + -0xb74)) + parseInt(_0x38ea75(0x201)) / (-0x1 * -0x2519 + -0x734 * -0x3 + -0x3ab2 * 0x1) + parseInt(_0x38ea75(0x204)) / (0x1d * 0x1d + -0xf3a + 0xbf5) * (-parseInt(_0x38ea75(0x1f1)) / (-0xe03 + 0x2487 + -0x167f)) + parseInt(_0x38ea75(0x203)) / (0x23f3 * -0x1 + 0x4ea + 0x1f0f) + -parseInt(_0x38ea75(0x20d)) / (-0x1 * -0xcc7 + -0x1907 * 0x1 + -0xc47 * -0x1) * (parseInt(_0x38ea75(0x1f8)) / (0x59f + -0x1734 + 0x119d)) + -parseInt(_0x38ea75(0x215)) / (0x767 * -0x1 + -0x4 * -0x517 + 0x33b * -0x4) + -parseInt(_0x38ea75(0x1e5)) / (-0x11c8 + 0x25f1 + -0x141f) * (-parseInt(_0x38ea75(0x1f3)) / (0x237a * 0x1 + -0x83 + -0x1176 * 0x2));
            if (_0x5198cd === _0x5e6088)
                break;
            else
                _0x40c0f6['push'](_0x40c0f6['shift']());
        } catch (_0x264842) {
            _0x40c0f6['push'](_0x40c0f6['shift']());
        }
    }
}(_0x598b, 0x1d1fb + 0xf9 * -0x32b + 0x6dc7c));
import _0x2fef5c from 'node-fetch';
function _0x27bb(_0x21bf1e, _0x40a355) {
    const _0x263489 = _0x598b();
    return _0x27bb = function (_0x5da95d, _0x4c130b) {
        _0x5da95d = _0x5da95d - (-0x2 * 0x56f + 0x1 * 0x164d + -0x98c);
        let _0x3dbf37 = _0x263489[_0x5da95d];
        return _0x3dbf37;
    }, _0x27bb(_0x21bf1e, _0x40a355);
}
import _0x5a1523 from 'dotenv';
_0x5a1523[_0x1b7dea(0x20a)]();
const GITHUB_RAW_URL = process[_0x1b7dea(0x212)][_0x1b7dea(0x20e) + _0x1b7dea(0x1f0)], fetchVoiceNotes = async () => {
        const _0x2cf027 = _0x1b7dea, _0x21559a = {
                'WednV': function (_0x5a8389, _0x698be1) {
                    return _0x5a8389(_0x698be1);
                },
                'qBpRx': _0x2cf027(0x213) + _0x2cf027(0x210) + _0x2cf027(0x206)
            };
        try {
            const _0x355885 = await _0x21559a[_0x2cf027(0x1f6)](_0x2fef5c, GITHUB_RAW_URL);
            if (!_0x355885['ok'])
                throw new Error(_0x2cf027(0x1ee) + _0x2cf027(0x1fe) + _0x2cf027(0x207) + _0x355885[_0x2cf027(0x202)]);
            const _0x1e17b7 = await _0x355885[_0x2cf027(0x1eb)]();
            return _0x1e17b7;
        } catch (_0x82ddba) {
            return console[_0x2cf027(0x1f4)](_0x21559a[_0x2cf027(0x211)], _0x82ddba), {};
        }
    }, handleGreeting = async (_0x2ec114, _0x17f106) => {
        const _0x537aa0 = _0x1b7dea, _0x23aeb3 = {
                'iKKYC': function (_0x5626ee) {
                    return _0x5626ee();
                },
                'NovMN': function (_0x107a49, _0x293e67) {
                    return _0x107a49 && _0x293e67;
                },
                'oKBoZ': _0x537aa0(0x1e3),
                'oBxyA': _0x537aa0(0x1ed) + _0x537aa0(0x1fd) + _0x537aa0(0x1fc) + _0x537aa0(0x1f7) + _0x537aa0(0x205),
                'gFZUf': _0x537aa0(0x1e9) + _0x537aa0(0x1f2) + _0x537aa0(0x1ec)
            };
        try {
            const _0x1debfd = _0x2ec114[_0x537aa0(0x1ff)][_0x537aa0(0x1e8) + 'e'](), _0x441568 = await _0x23aeb3[_0x537aa0(0x20f)](fetchVoiceNotes);
            if (_0x441568[_0x1debfd]) {
                const _0x54b354 = _0x441568[_0x1debfd][_0x537aa0(0x1f9)], _0x210c9b = _0x441568[_0x1debfd][_0x537aa0(0x200)][_0x537aa0(0x1fb)], _0x318780 = _0x441568[_0x1debfd][_0x537aa0(0x200)][_0x537aa0(0x209)];
                _0x23aeb3[_0x537aa0(0x1e7)](_0x54b354, _0x210c9b) && _0x318780 ? (await _0x17f106[_0x537aa0(0x208) + 'e'](_0x2ec114[_0x537aa0(0x1fa)], {
                    'audio': { 'url': _0x54b354 },
                    'mimetype': _0x23aeb3[_0x537aa0(0x1f5)],
                    'ptt': !![],
                    'contextInfo': {
                        'mentionedJid': [_0x2ec114[_0x537aa0(0x1ea)]],
                        'stanzaId': _0x2ec114[_0x537aa0(0x214)]['id'],
                        'participant': _0x2ec114[_0x537aa0(0x1ea)],
                        'quotedMessage': _0x2ec114[_0x537aa0(0x20b)]
                    }
                }), await _0x17f106[_0x537aa0(0x208) + 'e'](_0x2ec114[_0x537aa0(0x1fa)], {
                    'image': { 'url': _0x210c9b },
                    'caption': _0x318780,
                    'contextInfo': { 'mentionedJid': [_0x2ec114[_0x537aa0(0x1ea)]] }
                })) : console[_0x537aa0(0x1f4)](_0x23aeb3[_0x537aa0(0x20c)], {
                    'voiceNoteUrl': _0x54b354,
                    'imageUrl': _0x210c9b,
                    'captionText': _0x318780
                });
            } else
                await _0x17f106[_0x537aa0(0x208) + 'e'](_0x2ec114[_0x537aa0(0x1fa)], { 'contextInfo': { 'mentionedJid': [_0x2ec114[_0x537aa0(0x1ea)]] } });
        } catch (_0x5605cf) {
            console[_0x537aa0(0x1f4)](_0x23aeb3[_0x537aa0(0x1e4)], _0x5605cf);
        }
    };
export default handleGreeting;
function _0x598b() {
    const _0xe5e89e = [
        'json',
        'ing:',
        'Voice\x20note',
        'Failed\x20to\x20',
        '56673lCVcmK',
        'MESSAGE',
        '920050VvvzDk',
        'andleGreet',
        '6974990NnThvG',
        'error',
        'oKBoZ',
        'WednV',
        'caption\x20is',
        '5064uVEDsf',
        'voiceNote',
        'from',
        'url',
        'e\x20URL,\x20or\x20',
        '\x20URL,\x20imag',
        'fetch\x20voic',
        'body',
        'image',
        '759267mqvvBz',
        'statusText',
        '121818SaweJQ',
        '12xOnqjb',
        '\x20missing:',
        '\x20notes:',
        'e\x20notes:\x20',
        'sendMessag',
        'caption',
        'config',
        'message',
        'oBxyA',
        '6286bcxvbZ',
        'AUTO_SEND_',
        'iKKYC',
        'hing\x20voice',
        'qBpRx',
        'env',
        'Error\x20fetc',
        'key',
        '6097491VTIkgw',
        'audio/mp4',
        'gFZUf',
        '20VrAWgL',
        '22FBuXMo',
        'NovMN',
        'toLowerCas',
        'Error\x20in\x20h',
        'sender'
    ];
    _0x598b = function () {
        return _0xe5e89e;
    };
    return _0x598b();
}