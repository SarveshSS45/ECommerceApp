using System.Security.Claims;
using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AddressesController : ControllerBase
    {
        private readonly IAddressService _addressService;

        public AddressesController(IAddressService addressService)
        {
            _addressService = addressService;
        }

        private int GetUserId()
        {
            return int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );
        }

        // GET: api/Addresses
        [HttpGet]
        public async Task<IActionResult> GetMyAddresses()
        {
            var addresses =
                await _addressService.GetAddressesByUserIdAsync(GetUserId());

            return Ok(addresses);
        }

        // GET: api/Addresses/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAddress(int id)
        {
            var address =
                await _addressService.GetAddressByIdAsync(id);

            if (address == null)
            {
                return NotFound(
                    new ApiResponse<string>(
                        false,
                        "Address not found.",
                        null));
            }

            return Ok(address);
        }

        // POST: api/Addresses
        [HttpPost]
        public async Task<IActionResult> AddAddress(
            CreateAddressDTO dto)
        {
            var result =
                await _addressService.AddAddressAsync(
                    GetUserId(),
                    dto);

            return Ok(result);
        }

        // PUT: api/Addresses/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAddress(
            int id,
            UpdateAddressDTO dto)
        {
            var result =
                await _addressService.UpdateAddressAsync(
                    id,
                    GetUserId(),
                    dto);

            return Ok(result);
        }

        // DELETE: api/Addresses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            var result =
                await _addressService.DeleteAddressAsync(
                    id,
                    GetUserId());

            return Ok(result);
        }

        // PUT: api/Addresses/default/5
        [HttpPut("default/{id}")]
        public async Task<IActionResult> SetDefaultAddress(int id)
        {
            var result =
                await _addressService.SetDefaultAddressAsync(
                    id,
                    GetUserId());

            return Ok(result);
        }
    }
}