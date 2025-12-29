#!/usr/bin/env node

const command = process.argv[2];

if(command === "snapshot"){
    const snapshot = {
        meta:{
            tool: "infradiff",
            version: "0.1.0",
            createdAt: new Date().toISOString(),
            projectRoot: process.cwd(),
        },
        env: {},
        dependencies: {},
    };

    //printing the snapshot
    console.log(JSON.stringify(snapshot, null, 2));
}
else {
    console.log("Unknown command: Try 'snapshot' ");
}