
if (require.main === module) {
    require("./proto/job").boot(
        process.argv[2]
    ).catch(function (err) {
        console.error(err.stack);
        process.exit(1);
    });
}
