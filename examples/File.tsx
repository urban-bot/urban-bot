// import fs from 'fs';
// import path from 'path';
import React from 'react';
import { Button, ButtonGroup, File } from '../src';

// const file = fs.createReadStream(path.join(__dirname, 'file.doc'));

export function FileExample() {
    return (
        <File
            file={'urlToFile' /* || file */}
            title="There is the file"
            buttons={
                <ButtonGroup>
                    <Button
                        onClick={() => {
                            console.log('file');
                        }}
                    >
                        Button
                    </Button>
                </ButtonGroup>
            }
        />
    );
}
