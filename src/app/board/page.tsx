"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "@/components/navbar";
import TextCard from "./textcard";
import NavbarTail from "@/components/navbar-tail";

export default function Board() {
  return (
    <div>
      <NavbarTail />
    </div>
  );
}
