# warehouse-management-b2f

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Firebase

```
firebase deploy --only database
firebase deploy --only firestore
firebase deploy --only funtions
firebase deploy --only funtions:createUser functions:deleteUser ...
```

### default firebase account switching

```
firebase login serviceaccount@email.com
firebase use --add warehouse-management-b2f
firebase use warehouse-management-b2f

```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
