var entry = {
  'admin': {password: 'admin', role: 'admin'},
  'manager': {password: 'manager', role: 'manager'}
}

var roles = {
  'admin': {priority: 1},
  'manager': {priority: 2}
}

exports.entry = entry;
exports.roles = roles;