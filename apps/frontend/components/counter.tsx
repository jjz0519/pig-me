"use client";

import {useState} from "react";
import {Button} from "@heroui/button";

export const Counter = () => {
    const [count, setCount] = useState(0);

    return (
        <Button radius="full" onPress={() => setCount(count + 1)}>
            Count is {count}
        </Button>
    );
};
