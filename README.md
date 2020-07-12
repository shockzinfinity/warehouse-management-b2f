# warehouse-management

## Dependencies

```bash
$ yarn
$ cd functions && yarn
$ cd ..
```

### Compiles and hot-reloads for development

```bash
# compile & hot-reloads
$ yarn serve
# compile & minifies
$ yarn build
```

### Firebase

```bash
$ firebase deploy --only database
$ firebase deploy --only firestore
$ firebase deploy --only funtions
$ firebase deploy --only funtions:createUser functions:deleteUser ...
```

### Default firebase account switching

#### add new env var in .firebaserc

![firebaserc file](./doc/.firebaserc.png)

```bash
# for prod
$ firebase login serviceaccount@email.com
$ firebase use --add ctk-warehouse-management
$ firebase use ctk-warehouse-management

# for dev
$ firebase login serviceaccount@email.com
$ firebase use --add warehouse-management-b2f
$ firebase use warehouse-management-b2f
```

### Setting

```bash
# for prod
$ firebase functions:config:set admin.prod.email=serviceaccount@email.com admin.prod.db_url=https://ctk-warehouse-management.firebaseio.com

# for dev
$ firebase functions:config:set admin.dev.email=serviceaccount@email.com admin.dev.db_url=https://warehouse-management-b2f.firebaseio.com

$ firebase functions:config:get
$ firebase deploy --only functions
```

### Customize configuration

#### check configuration files for firebase

```bash
key.prod.json
key.dev.json
functions/index.js
firebaseConfig.prod.js
firebaseConfig.dev.js
.firebaserc
firebase logout
firebase login
firebase use ctk-warehouse-management
firebase use warehouse-management-b2f
```

#### other configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
