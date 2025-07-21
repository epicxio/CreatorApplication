const Permission = require('../models/Permission');
const { allResources, permissionActions } = require('../config/permissions');

const syncPermissions = async () => {
  try {
    console.log('Syncing permissions...');
    const dbPermissions = await Permission.find({});

    const configPermissionKeys = new Set();
    allResources.forEach(resource => {
      permissionActions.forEach(action => {
        configPermissionKeys.add(`${resource}:${action}`);
      });
    });

    const dbPermissionKeys = new Set(dbPermissions.map(p => `${p.resource}:${p.action}`));

    const keysToAdd = [...configPermissionKeys].filter(key => !dbPermissionKeys.has(key));
    const permissionsToRemove = dbPermissions.filter(p => !configPermissionKeys.has(`${p.resource}:${p.action}`));

    if (keysToAdd.length > 0) {
      const newPermissions = keysToAdd.map(key => {
        const [resource, action] = key.split(':');
        return { name: key, resource, action };
      });
      await Permission.insertMany(newPermissions);
      console.log(`${keysToAdd.length} new permissions added.`);
    }

    if (permissionsToRemove.length > 0) {
      const idsToRemove = permissionsToRemove.map(p => p._id);
      await Permission.deleteMany({ _id: { $in: idsToRemove } });
      console.log(`${permissionsToRemove.length} obsolete permissions removed.`);
    }

    // Also, let's fix any existing permissions that might have an incorrect name
    const permissionsToUpdate = dbPermissions.filter(p => p.name !== `${p.resource}:${p.action}`);
    if (permissionsToUpdate.length > 0) {
      const bulkOps = permissionsToUpdate.map(p => ({
        updateOne: {
          filter: { _id: p._id },
          update: { $set: { name: `${p.resource}:${p.action}` } }
        }
      }));
      await Permission.bulkWrite(bulkOps);
      console.log(`${permissionsToUpdate.length} permissions had their names updated.`);
    }

    if (keysToAdd.length === 0 && permissionsToRemove.length === 0 && permissionsToUpdate.length === 0) {
      console.log('Permissions are already up to date.');
    } else {
      console.log('Permission sync complete.');
    }
  } catch (error) {
    console.error('Error syncing permissions:', error);
  }
};

module.exports = { syncPermissions }; 