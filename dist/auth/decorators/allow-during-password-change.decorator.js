"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowDuringPasswordChange = void 0;
const common_1 = require("@nestjs/common");
const auth_constants_1 = require("../auth.constants");
const AllowDuringPasswordChange = () => (0, common_1.SetMetadata)(auth_constants_1.ALLOW_DURING_PASSWORD_CHANGE_KEY, true);
exports.AllowDuringPasswordChange = AllowDuringPasswordChange;
//# sourceMappingURL=allow-during-password-change.decorator.js.map