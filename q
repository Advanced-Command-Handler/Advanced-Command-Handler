[33mcommit 2879e62273fafd156776eba2f524da4167da8f05[m[33m ([m[1;36mHEAD -> [m[1;32mmaster[m[33m)[m
Merge: 1dc3797 52b5f7a
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Mon Jan 18 18:31:09 2021 +0100

    Merge branch 'master' of https://github.com/Ayfri/Advanced-Command-Handler

[33mcommit 52b5f7a483b738c2bf16fdf17dee5030a61238c0[m[33m ([m[1;31morigin/master[m[33m)[m
Merge: 39c5317 0279447
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Mon Jan 18 18:16:52 2021 +0100

    Merge pull request #57 from Sxmurai/master

[33mcommit 0279447dab51bd4a4a1a4764926004b87fe45c01[m
Author: aesthetical <57580886+Sxmurai@users.noreply.github.com>
Date:   Mon Jan 18 11:09:00 2021 -0600

    fix spelling, and format/improve some code

[33mcommit dfa2a2719cb70dbcbfc830fe8b31ed002a8db895[m
Author: aesthetical <57580886+Sxmurai@users.noreply.github.com>
Date:   Mon Jan 18 11:06:22 2021 -0600

    fix a spelling error

[33mcommit 1dc379726ba80141c69e54a6dbc5f368e0176fd7[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Mon Jan 18 09:41:02 2021 +0100

    Simplified prettier script.

[33mcommit 39c53173a965aff957ab42e0ae836753d38f08f6[m
Merge: 7f9cce4 05bd2e5
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 04:54:40 2021 +0100

    Merge pull request #56 from Ayfri/feat/improvingCooldowns

[33mcommit 05bd2e543075dea8c2376ac580d55d06b40f8e23[m[33m ([m[1;32mfeat/improvingCooldowns[m[33m)[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 04:47:18 2021 +0100

    More fixes.

[33mcommit 1c10690d4280b308eb7cdc8156b9aa8f555ae585[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 04:44:50 2021 +0100

    Fixes.

[33mcommit 9a12f7f63642b0962bd83deca1aec2bda458e966[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 04:36:49 2021 +0100

    Added error message in isInRightChannel handling in default message event.

[33mcommit 77f574ba8e5ac858774e8aaef3677332d44222fd[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 04:35:07 2021 +0100

    Prettified code.

[33mcommit 110d94fd5591ec1742f2e42edff2d7ce13bf7804[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 04:33:56 2021 +0100

    say test command has now a cooldown of 10.

[33mcommit 44d714fcfe77fc29257fc798075ff49e4d85f4ef[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 04:33:25 2021 +0100

    Fixed EOL for utils.ts.

[33mcommit 704a45c3a157333eae62f42da45e1b80362c5de7[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 04:33:04 2021 +0100

    Added cooldown handling in default message event.

[33mcommit afb37dfd1eaa5c464ddf003fda06c2303b7f8568[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 04:32:47 2021 +0100

    Added getCooldown method for Command class.

[33mcommit c2391c093772cdfca58298b3c707ec8dbc9c0461[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 04:25:20 2021 +0100

    Renamed addToCooldown method to setCooldown, added setTimeout to removed user to cooldown, user is not added in cooldowns if no cooldown is set for the command.

[33mcommit c40b4e6e9b88412499f11e9b5d8f26736c7c73e4[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 04:21:05 2021 +0100

    Added addToCooldown method to Command class.

[33mcommit 98e94b8da14991c0a46e0b2cd537c7be023892bc[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 04:19:36 2021 +0100

    Fixed/simplified cooldowns types.

[33mcommit 76e82521e7a66e1b1fe513966526435d13c68705[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 03:55:55 2021 +0100

    Added isInCooldown method in Command class.

[33mcommit 839ed01bf4f91fbb9bb7132e9ca0ebb44d804a94[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 03:55:31 2021 +0100

    Improved typing for cooldowns collection.

[33mcommit 7f9cce43a94b3092926e748ef82f826ab765dd10[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 03:40:19 2021 +0100

    Improved types for getKeyByValue.

[33mcommit 4988d37d5035af1bcf7243854b2d6d57bd1d2eb4[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 03:17:29 2021 +0100

    Added 'random', 'getKeyByValue', 'cutIfTooLong' functions in 'utils.ts'.

[33mcommit d471318c34f5f3b6ab7eff8501ed044b33d7adff[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 02:36:53 2021 +0100

    Added types to .gitignore.

[33mcommit 442916f9aee2a8eb580bb2bae4860b3cb498003f[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 02:36:39 2021 +0100

    Updated .dcignore.

[33mcommit d0ae29113463051c3aa80a57a85c8ddb032e08e6[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 02:35:56 2021 +0100

    Added comments to .npmignore.

[33mcommit 961fc1670d73aee02af75859cab0399487509434[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 02:29:47 2021 +0100

    Fixed tests modules.

[33mcommit c37ccef82c7e2a6312211d125c83ee57f26bf684[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 02:28:50 2021 +0100

    Fixed 'types' property in package.json.

[33mcommit 8b3a89ba6e647f97a3d7a2d1899815c59c9aeba4[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 02:15:47 2021 +0100

    Tests now using code from package.json, not directly dist dir.

[33mcommit 45d65ec53b0e96cfd4f64b7b4f6201da2f00039e[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sun Jan 17 02:14:11 2021 +0100

    Added 'declarationDir' property in TSConfig, updated ts-node require.

[33mcommit 6927107476ba3bf50b0c061122e0dbc975cc89d1[m[33m ([m[1;33mtag: 2.2.2[m[33m)[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sat Jan 16 20:52:10 2021 +0100

    Bumped version to 2.2.2.

[33mcommit affb1e39e683169b064c40b605c11474ce708a49[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sat Jan 16 20:51:53 2021 +0100

    Updated @types/node to 14.14.21.

[33mcommit 7417f06a1deebec361676778ad3bfe7d855e2dff[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sat Jan 16 20:50:52 2021 +0100

    Fixed test.

[33mcommit aeebb5fa22541077f29c3a00e98a94e602c04428[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sat Jan 16 20:50:37 2021 +0100

    Fixed default message event.

[33mcommit 316126a41ae1c6d00866cbd0d19bf6571ffa043a[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sat Jan 16 20:40:57 2021 +0100

    Fixed getMissingPermissions.

[33mcommit b1c49307c75c4246f2ea9abe2af2056891086396[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Sat Jan 16 20:40:13 2021 +0100

    Fixed permissionsError using a non-existant BetterEmbed template.

[33mcommit 0866848482e7cffc87db6dae086a472a499e2821[m[33m ([m[1;33mtag: 2.2.1[m[33m)[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Wed Jan 13 13:19:04 2021 +0100

    Improved consistency in command handler loading logs.

[33mcommit 3051516c4ec953c16b01359e09655982c5c8cacf[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Wed Jan 13 13:13:51 2021 +0100

    Bumped version to 2.2.1.

[33mcommit 37ac2cd930dcbe71d1876f4ef70fe844d3498521[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Wed Jan 13 13:13:17 2021 +0100

    Updated dayjs to 1.10.3.

[33mcommit c456ce1a735a85a8b37b9a96a4b9259239ff9b7a[m
Merge: f4ea9e4 aed7c3a
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Wed Jan 13 13:12:33 2021 +0100

    Merge branch 'defaults'

[33mcommit aed7c3a105369aa18587d7b266d6c44fd79ceaca[m[33m ([m[1;32mdefaults[m[33m)[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Wed Jan 13 13:11:45 2021 +0100

    Improved error for invalid permissions.

[33mcommit e4e59c646251346f80ba8a99564d3e2934176a7b[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Wed Jan 13 13:10:36 2021 +0100

    Fixed invalid permissions checking in CommandLoader.

[33mcommit f4ea9e44d3d9fa143c40c1f42496c4fcd7f05fa1[m
Merge: 4d4ff97 5570469
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Mon Jan 11 13:51:04 2021 +0100

    Merge pull request #51 from Ayfri/dependabot/npm_and_yarn/dayjs-1.10.3
    
    Bump dayjs from 1.10.2 to 1.10.3

[33mcommit 5570469900ead1e51b92685ed5bcf88d3a4a2651[m
Author: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
Date:   Mon Jan 11 06:56:48 2021 +0000

    Bump dayjs from 1.10.2 to 1.10.3
    
    Bumps [dayjs](https://github.com/iamkun/dayjs) from 1.10.2 to 1.10.3.
    - [Release notes](https://github.com/iamkun/dayjs/releases)
    - [Changelog](https://github.com/iamkun/dayjs/blob/dev/CHANGELOG.md)
    - [Commits](https://github.com/iamkun/dayjs/compare/v1.10.2...v1.10.3)
    
    Signed-off-by: dependabot[bot] <support@github.com>

[33mcommit 4d4ff97f289aff39a240941e85b348a861a1df32[m[33m ([m[1;33mtag: 2.2.0[m[33m)[m
Merge: 4c34c3f b07a300
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Fri Jan 8 21:47:48 2021 +0100

    Merge pull request #50 from Ayfri/defaults

[33mcommit b07a3000bee12c7f4e319dad16252a2faa1da308[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 17:08:06 2021 +0100

    Fixed #45.

[33mcommit 3574973d50ce9319487ce528eb7225572a26d946[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 16:52:20 2021 +0100

    Fixed thinkgs.

[33mcommit 625277a8ea4d9d93294cfd712ced15099a3b60b2[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 16:48:53 2021 +0100

    Revert "Set category property in Command class as non-nullable."
    
    This reverts commit e4da1b70716f5ca9e28ec29d58691156c53c849a.

[33mcommit 2193652f749723fb25522a93c4cd31b982af25c4[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 16:48:12 2021 +0100

    Set category property in Command class as non-nullable.

[33mcommit e4da1b70716f5ca9e28ec29d58691156c53c849a[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 16:42:23 2021 +0100

    Fixed typo.

[33mcommit e8a111cb9af71e3588590fb81e3c014e9a026f56[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 16:41:54 2021 +0100

    Fixed returns types in README.

[33mcommit 09939a83894b6a26933c5841172b476bc85fdc7e[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 16:41:11 2021 +0100

    Added default commands to README.

[33mcommit 463396db052accea0502ad0d2ca8bcf26945981f[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 16:38:01 2021 +0100

    Now using defaultCommands into tests.

[33mcommit 80a5178147fcd8768415826f8c93dc7fea81f8bf[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 16:37:26 2021 +0100

    Now using a different way to detect if not on dm.

[33mcommit a681c3f70a1afbc532bd09fe78ce57ad72a08324[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 16:36:40 2021 +0100

    Fixed loadCommand putting the file name and not the command name.

[33mcommit f830c84125e22acbc521d845ed8653bbf9bbaf4c[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 16:36:00 2021 +0100

    Added setDefaultCommands method.

[33mcommit 39390b7f3c8e1c418d11b95dc667d70646046e7e[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 16:35:22 2021 +0100

    Added default 'ping' command.

[33mcommit b19342671fce1c31472925a45f3aae564b438160[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 16:09:53 2021 +0100

    Binded version to 2.2.0.

[33mcommit 8e440ddbedb2a0264ddfcd19f16ebb1ead019113[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 16:07:06 2021 +0100

    Prettify code.

[33mcommit 7e1feec45d4618db38efb19efb00730bacc30e55[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 16:06:42 2021 +0100

    Added Defaults section.

[33mcommit 35de67ea596b0fc98a6de944f82249ebc5a616fc[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 16:02:07 2021 +0100

    Added setDefaultEvents function in README.

[33mcommit d23de3ebe86fa7a2810dbcab6632af27df09903d[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 16:00:41 2021 +0100

    Added Event Class and fixed things in README.

[33mcommit 7c7b2654853cee5ef813d448a3166d529ec38b72[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 15:55:38 2021 +0100

    Updated CommandHandler section in README.

[33mcommit 07c6c5a0528653d6e8c411a93f032c9341f3eadf[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 15:48:21 2021 +0100

    Added new Event system to README.

[33mcommit 37b1fdd035946104c8305a546faa5a9d62ee8af2[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 15:46:45 2021 +0100

    Added DefaultCommandRunFunction type.

[33mcommit 0c571bc020eba9810b5469427832b2d0a1b5ce42[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 15:38:14 2021 +0100

    Removed message event from tests as now using default message event.

[33mcommit 9d4d58c8884e61e55d2e5ee9576590c84269cab0[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Thu Jan 7 15:30:32 2021 +0100

    Updated dayjs to 1.10.2.

[33mcommit 4c34c3fdd4d2d1fffe9cf8d8a79fdeff4b4f3868[m
Merge: c99d16e ae68afc
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Wed Jan 6 08:25:17 2021 +0100

    Merge pull request #49 from Ayfri/dependabot/npm_and_yarn/dayjs-1.10.2
    
    Bump dayjs from 1.10.1 to 1.10.2

[33mcommit ae68afc38f374cee5b16eb31e9889b42da71dc98[m
Author: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
Date:   Wed Jan 6 05:51:41 2021 +0000

    Bump dayjs from 1.10.1 to 1.10.2
    
    Bumps [dayjs](https://github.com/iamkun/dayjs) from 1.10.1 to 1.10.2.
    - [Release notes](https://github.com/iamkun/dayjs/releases)
    - [Changelog](https://github.com/iamkun/dayjs/blob/dev/CHANGELOG.md)
    - [Commits](https://github.com/iamkun/dayjs/compare/v1.10.1...v1.10.2)
    
    Signed-off-by: dependabot[bot] <support@github.com>

[33mcommit 946d7f21bd61da502ddad02a154d8cfd653655cb[m
Merge: 1639c62 07e339f
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Mon Jan 4 14:43:19 2021 +0100

    Merge commit '07e339f' into defaults

[33mcommit c99d16e7986ee48e988f5dbd5028c2ac45ebb949[m
Merge: d45b696 07e339f
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Mon Jan 4 14:42:53 2021 +0100

    Merge pull request #48 from Ayfri/dependabot/npm_and_yarn/dayjs-1.10.1
    
    Bump dayjs from 1.9.8 to 1.10.1

[33mcommit 07e339f99d7211135dea49f54139769deeae10d4[m
Author: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
Date:   Mon Jan 4 07:13:02 2021 +0000

    Bump dayjs from 1.9.8 to 1.10.1
    
    Bumps [dayjs](https://github.com/iamkun/dayjs) from 1.9.8 to 1.10.1.
    - [Release notes](https://github.com/iamkun/dayjs/releases)
    - [Changelog](https://github.com/iamkun/dayjs/blob/v1.10.1/CHANGELOG.md)
    - [Commits](https://github.com/iamkun/dayjs/compare/v1.9.8...v1.10.1)
    
    Signed-off-by: dependabot[bot] <support@github.com>

[33mcommit 1639c6221d3d83468a5384efa5ed447278788d60[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Mon Jan 4 05:16:05 2021 +0100

    Added tests for default events.

[33mcommit a44f6c993254b3715a5446345e3bcbae02315334[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Mon Jan 4 05:15:22 2021 +0100

    Remade event loading, now binding events for less spaghetti code.

[33mcommit 3f71df5f63a4e93bb4ae0a4627c8641a17a108f5[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Mon Jan 4 05:14:42 2021 +0100

    Added bind & unbind methods to Event class.

[33mcommit e785fffcc8ccdbbf575800987bdd0494f204eebd[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Mon Jan 4 04:53:41 2021 +0100

    Client is now created in create function, ClientOptions are required in create function.

[33mcommit d6c0219eb60d8295189cba4229269c65e4b9d043[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Mon Jan 4 04:50:31 2021 +0100

    Added log messages for default events loading.

[33mcommit 9c0b13dba849f26f6a110147b10e8c02fc414308[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Mon Jan 4 04:42:46 2021 +0100

    Added event return value for loadEvent function.

[33mcommit d085682744644b44789790e44e77a6b341107794[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Mon Jan 4 04:41:02 2021 +0100

    Added setDefaultEvents function.

[33mcommit e378d4ae5b294d22f0f7c5321309e5634e89bd0a[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Mon Jan 4 04:30:19 2021 +0100

    Added 'default' handle in loadEvent function.

[33mcommit 2a652205341b8da2e8e5283e425db83756b28e42[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Mon Jan 4 04:26:29 2021 +0100

    Fixed imports/exports for default events.

[33mcommit 57db081a0dcf1725b808494de01a2c175798772a[m
Author: Ayfri <pierre.ayfri@gmail.com>
Date:   Mon Jan 4 04:10:42 2021 +0100

    Added loadEvent function.
