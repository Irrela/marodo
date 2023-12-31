"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Navbar from "@/components/navbar";
import TextCard from "./textcard";

export default function Board() {
  return (
    <div>
      <Navbar />
      <TextCard />
    </div>
  );
}
